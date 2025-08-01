/**
 * Copyright 2025 RAIDS Lab
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { REFETCH_INTERVAL } from '@/config/task'
import { getHeader, jobToolbarConfig } from '@/pages/Portal/Job/statuses'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { useAtomValue } from 'jotai'
import { Trash2Icon } from 'lucide-react'
import { useMemo } from 'react'
import { toast } from 'sonner'

import JobPhaseLabel from '@/components/badge/JobPhaseBadge'
import JobTypeLabel from '@/components/badge/JobTypeBadge'
import NodeBadges from '@/components/badge/NodeBadges'
import ResourceBadges from '@/components/badge/ResourceBadges'
import DocsButton from '@/components/button/DocsButton'
import SplitLinkButton from '@/components/button/SplitLinkButton'
import { DataTable } from '@/components/custom/DataTable'
import { DataTableColumnHeader } from '@/components/custom/DataTable/DataTableColumnHeader'
import { TimeDistance } from '@/components/custom/TimeDistance'
import TooltipButton from '@/components/custom/TooltipButton'
import JupyterIcon from '@/components/icon/JupyterIcon'
import { JobActionsMenu } from '@/components/job/job-actions-menu'
import { JobNameCell } from '@/components/label/JobNameLabel'

import {
  JobPhase,
  apiJobDelete,
  apiJobInteractiveList,
  apiJupyterTokenGet,
} from '@/services/api/vcjob'
import { IJobInfo, JobType } from '@/services/api/vcjob'

import { logger } from '@/utils/loglevel'
import { globalJobUrl } from '@/utils/store'

import Quota from './Quota'

const InterOverview = () => {
  const jobType = useAtomValue(globalJobUrl)
  const queryClient = useQueryClient()

  const interactiveQuery = useQuery({
    queryKey: ['job', 'interactive'],
    queryFn: apiJobInteractiveList,
    select: (res) => res.data.filter((task) => task.jobType === JobType.Jupyter),
    refetchInterval: REFETCH_INTERVAL,
  })

  const refetchTaskList = async () => {
    try {
      // 隔 200ms 并行发送所有异步请求
      await Promise.all([
        new Promise((resolve) => setTimeout(resolve, 200)).then(() =>
          queryClient.invalidateQueries({ queryKey: ['job'] })
        ),
        new Promise((resolve) => setTimeout(resolve, 200)).then(() =>
          queryClient.invalidateQueries({ queryKey: ['context', 'quota'] })
        ),
      ])
    } catch (error) {
      logger.error('更新查询失败', error)
    }
  }

  const { mutate: deleteTask } = useMutation({
    mutationFn: apiJobDelete,
    onSuccess: async () => {
      await refetchTaskList()
      toast.success('操作成功')
    },
  })

  const { mutate: getPortToken } = useMutation({
    mutationFn: (jobName: string) => apiJupyterTokenGet(jobName),
    onSuccess: (_, jobName) => {
      window.open(`/job/jupyter/${jobName}`)
    },
  })

  const interColumns = useMemo<ColumnDef<IJobInfo>[]>(
    () => [
      {
        accessorKey: 'jobType',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={getHeader('jobType')} />
        ),
        cell: ({ row }) => <JobTypeLabel jobType={row.getValue<JobType>('jobType')} />,
      },
      {
        accessorKey: 'name',
        header: ({ column }) => <DataTableColumnHeader column={column} title={getHeader('name')} />,
        cell: ({ row }) => <JobNameCell jobInfo={row.original} />,
      },
      {
        accessorKey: 'status',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={getHeader('status')} />
        ),
        cell: ({ row }) => {
          return <JobPhaseLabel jobPhase={row.getValue<JobPhase>('status')} />
        },
        filterFn: (row, id, value) => {
          return (value as string[]).includes(row.getValue(id))
        },
      },
      {
        accessorKey: 'nodes',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={getHeader('nodes')} />
        ),
        cell: ({ row }) => {
          const nodes = row.getValue<string[]>('nodes')
          return <NodeBadges nodes={nodes} />
        },
      },
      {
        accessorKey: 'resources',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={getHeader('resources')} />
        ),
        cell: ({ row }) => {
          const resources = row.getValue<Record<string, string> | undefined>('resources')
          return <ResourceBadges resources={resources} />
        },
      },
      {
        accessorKey: 'createdAt',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={getHeader('createdAt')} />
        ),
        cell: ({ row }) => {
          return <TimeDistance date={row.getValue('createdAt')}></TimeDistance>
        },
        sortingFn: 'datetime',
      },
      {
        accessorKey: 'startedAt',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={getHeader('startedAt')} />
        ),
        cell: ({ row }) => {
          return <TimeDistance date={row.getValue('startedAt')}></TimeDistance>
        },
        sortingFn: 'datetime',
      },
      {
        accessorKey: 'completedAt',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={getHeader('completedAt')} />
        ),
        cell: ({ row }) => {
          return <TimeDistance date={row.getValue('completedAt')}></TimeDistance>
        },
        sortingFn: 'datetime',
      },
      {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
          const jobInfo = row.original
          const shouldDisable = jobInfo.status !== 'Running'
          return (
            <div className="flex flex-row space-x-1">
              {shouldDisable ? (
                <div className="h-8 w-8" />
              ) : (
                <TooltipButton
                  variant="ghost"
                  size="icon"
                  className="text-primary hover:bg-primary/10 hover:text-primary/90 h-8 w-8"
                  tooltipContent="打开 Jupyter Lab"
                  onClick={() => {
                    toast.info('即将打开 Jupyter 页面')
                    setTimeout(() => {
                      getPortToken(jobInfo.jobName)
                    }, 500)
                  }}
                  disabled={shouldDisable}
                >
                  <JupyterIcon className="size-4" />
                </TooltipButton>
              )}
              <JobActionsMenu jobInfo={jobInfo} onDelete={deleteTask} />
            </div>
          )
        },
      },
    ],
    [deleteTask, getPortToken]
  )

  return (
    <DataTable
      info={{
        title: 'Jupyter Lab',
        description: '提供开箱即用的 Jupyter Lab， 可用于测试、调试等',
      }}
      storageKey="portal_job_interactive"
      query={interactiveQuery}
      columns={interColumns}
      toolbarConfig={jobToolbarConfig}
      multipleHandlers={[
        {
          title: (rows) => `停止或删除 ${rows.length} 个作业`,
          description: (rows) => (
            <>
              作业 {rows.map((row) => row.original.name).join(', ')} 将被停止或删除，确认要继续吗？
            </>
          ),
          icon: <Trash2Icon className="text-destructive" />,
          handleSubmit: (rows) => {
            rows.forEach((row) => {
              deleteTask(row.original.jobName)
            })
          },
          isDanger: true,
        },
      ]}
      briefChildren={<Quota />}
    >
      <div className="flex flex-row gap-3">
        <DocsButton title="查看文档" url="quick-start/interactive" />
        <SplitLinkButton
          title="interactive"
          urls={[
            {
              url: `portal/job/inter/new-jupyter-${jobType}`,
              name: ' Jupyter Lab',
            },
          ]}
        />
      </div>
    </DataTable>
  )
}

export default InterOverview
