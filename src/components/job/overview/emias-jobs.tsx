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
import { getHeader } from '@/pages/Portal/Job/statuses'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { ColumnDef } from '@tanstack/react-table'
import { useAtomValue } from 'jotai'
import { Trash2Icon } from 'lucide-react'
import { useMemo } from 'react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import JobPhaseLabel, { jobPhases } from '@/components/badge/JobPhaseBadge'
import JobTypeLabel from '@/components/badge/JobTypeBadge'
import ResourceBadges from '@/components/badge/ResourceBadges'
import SplitLinkButton from '@/components/button/SplitLinkButton'
import { DataTable } from '@/components/custom/DataTable'
import { DataTableColumnHeader } from '@/components/custom/DataTable/DataTableColumnHeader'
import { DataTableToolbarConfig } from '@/components/custom/DataTable/DataTableToolbar'
import { TimeDistance } from '@/components/custom/TimeDistance'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui-custom/alert-dialog'

import { apiJobBatchList, apiJobDelete } from '@/services/api/vcjob'
import { IJobInfo, JobType } from '@/services/api/vcjob'

import { logger } from '@/utils/loglevel'
import { globalJobUrl } from '@/utils/store'

import Quota from '../../../pages/Portal/Job/Interactive/Quota'

export const priorities = [
  {
    label: '高',
    value: 'high',
    className: 'text-highlight-amber border-highlight-amber bg-highlight-amber/20',
  },
  {
    label: '低',
    value: 'low',
    className: 'text-highlight-slate border-highlight-slate bg-highlight-slate/20',
  },
]

export const profilingStatuses = [
  {
    value: '0',
    label: '未分析',
    className: 'text-highlight-purple border-highlight-purple bg-highlight-purple/20',
  },
  {
    value: '1',
    label: '待分析',
    className: 'text-highlight-slate border-highlight-slate bg-highlight-slate/20',
  },
  {
    value: '2',
    label: '分析中',
    className: 'text-highlight-sky border-highlight-sky bg-highlight-sky/20',
  },
  {
    value: '3',
    label: '已分析',
    className: 'text-highlight-emerald border-highlight-emerald bg-highlight-emerald/20',
  },
  {
    value: '4',
    label: '失败',
    className: 'text-highlight-red border-highlight-red bg-highlight-red/20',
  },
  {
    value: '5',
    label: '跳过',
    className: 'text-highlight-slate border-highlight-slate bg-highlight-slate/20',
  },
]

const toolbarConfig: DataTableToolbarConfig = {
  filterInput: {
    placeholder: '搜索名称',
    key: 'title',
  },
  filterOptions: [
    {
      key: 'status',
      title: '作业状态',
      option: jobPhases,
    },
    {
      key: 'priority',
      title: '优先级',
      option: priorities,
    },
    {
      key: 'profileStatus',
      title: '分析状态',
      option: profilingStatuses,
    },
  ],
  getHeader: getHeader,
}

interface ColocateJobInfo extends IJobInfo {
  id: number
  profileStatus: string
  priority: string
}

const ColocateOverview = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const jobType = useAtomValue(globalJobUrl)

  const batchQuery = useQuery({
    queryKey: ['job', 'batch'],
    queryFn: apiJobBatchList,
    select: (res) =>
      res.data
        .filter((task) => task.jobType !== JobType.Jupyter)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)) as unknown as ColocateJobInfo[],
    refetchInterval: REFETCH_INTERVAL,
  })

  const refetchTaskList = async () => {
    try {
      // 并行发送所有异步请求
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['job'] }),
        queryClient.invalidateQueries({ queryKey: ['aitask', 'quota'] }),
        queryClient.invalidateQueries({ queryKey: ['aitask', 'stats'] }),
      ])
    } catch (error) {
      logger.error('更新查询失败', error)
    }
  }

  const { mutate: deleteTask } = useMutation({
    mutationFn: apiJobDelete,
    onSuccess: async () => {
      await refetchTaskList()
      toast.success('作业已删除')
    },
  })

  const batchColumns = useMemo<ColumnDef<ColocateJobInfo>[]>(
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
        cell: ({ row }) => (
          <Link to={`${row.original.id}`} className="underline-offset-4 hover:underline">
            {row.getValue('name')}
          </Link>
        ),
      },
      {
        accessorKey: 'owner',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={getHeader('owner')} />
        ),
        cell: ({ row }) => <div>{row.getValue('owner')}</div>,
      },
      {
        accessorKey: 'status',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={getHeader('status')} />
        ),
        cell: ({ row }) => <JobPhaseLabel jobPhase={row.getValue('status')} />,
        filterFn: (row, id, value) => {
          return (value as string[]).includes(row.getValue(id))
        },
      },
      {
        accessorKey: 'priority',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={getHeader('priority')} />
        ),
        cell: ({ row }) => {
          const priority = priorities.find(
            (priority) => priority.value === row.getValue('priority')
          )
          if (!priority) {
            return null
          }
          return (
            <Badge className={priority.className} variant="outline">
              {priority.label}
            </Badge>
          )
        },
        filterFn: (row, id, value) => {
          return (value as string[]).includes(row.getValue(id))
        },
        enableSorting: false,
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
        accessorKey: 'profileStatus',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={getHeader('profileStatus')} />
        ),
        cell: ({ row }) => {
          let profiling = profilingStatuses.find(
            (profiling) => profiling.value === row.getValue('profileStatus')
          )
          if (!profiling) {
            return null
          }
          if (row.getValue<string>('status') === 'Succeeded') {
            profiling = {
              value: '3',
              label: '已分析',
              className: 'text-highlight-emerald border-highlight-emerald bg-highlight-emerald/20',
            }
          }
          return (
            <Badge className={profiling.className} variant="outline">
              {profiling.label}
            </Badge>
          )
        },
        filterFn: (row, id, value) => {
          return (value as string[]).includes(row.getValue(id))
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
          const taskInfo = row.original
          return (
            <AlertDialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">操作</span>
                    <DotsHorizontalIcon className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel className="text-muted-foreground text-xs">
                    操作
                  </DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => navigate({ to: `${taskInfo.jobName}` })}>
                    详情
                  </DropdownMenuItem>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem>删除</DropdownMenuItem>
                  </AlertDialogTrigger>
                </DropdownMenuContent>
              </DropdownMenu>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>删除作业</AlertDialogTitle>
                  <AlertDialogDescription>
                    作业「{taskInfo?.name}」将不再可见，请谨慎操作。
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>取消</AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    onClick={() => deleteTask(taskInfo.id.toString())}
                  >
                    删除
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )
        },
      },
    ],
    [deleteTask, navigate]
  )

  return (
    <>
      <DataTable
        info={{
          title: '自定义作业',
          description: '使用自定义作业进行训练、推理等任务',
        }}
        storageKey="portal_aijob_batch"
        query={batchQuery}
        columns={batchColumns}
        toolbarConfig={toolbarConfig}
        multipleHandlers={[
          {
            title: (rows) => `停止或删除 ${rows.length} 个作业`,
            description: (rows) => (
              <>
                作业 {rows.map((row) => row.original.name).join(', ')}{' '}
                将被停止或删除，确认要继续吗？
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
        <SplitLinkButton
          title="batch"
          urls={[
            {
              url: 'portal/job/batch/new-' + jobType,
              name: '自定义作业',
            },
            {
              url: 'portal/job/batch/new-tensorflow',
              name: ' Tensorflow PS 作业',
              disabled: true,
            },
            {
              url: 'portal/job/batch/new-pytorch',
              name: ' Pytorch DDP 作业',
              disabled: true,
            },
            {
              url: 'portal/job/batch/new-ray',
              name: ' Ray 作业',
              disabled: true,
            },
            {
              url: 'portal/job/batch/new-deepspeed',
              name: ' DeepSpeed 作业',
              disabled: true,
            },
            {
              url: 'portal/job/batch/new-openmpi',
              name: ' OpenMPI 作业',
              disabled: true,
            },
          ]}
        />
      </DataTable>
    </>
  )
}

export default ColocateOverview
