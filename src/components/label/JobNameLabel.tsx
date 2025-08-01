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
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { LockIcon } from 'lucide-react'

import TooltipLink from '@/components/label/TooltipLink'

import { IJobInfo, JobStatus, getJobStateType } from '@/services/api/vcjob'

import TipBadge from '../badge/TipBadge'

interface JobNameCellProps {
  jobInfo: IJobInfo
}

// 格式化锁定日期为中文格式
const formatLockDate = (timestamp?: string) => {
  const date = new Date(timestamp ?? Date.now())
  return format(date, 'M月d日 HH:mm', { locale: zhCN })
}

export const JobNameCell = ({ jobInfo }: JobNameCellProps) => {
  return (
    <div className="relative flex items-center">
      <TooltipLink
        name={
          <div className="flex flex-row items-center">
            <p className="max-w-36 truncate">{jobInfo.name}</p>
            {jobInfo.locked && <LockIcon className="text-muted-foreground ml-1 h-4 w-4" />}
          </div>
        }
        to={
          getJobStateType(jobInfo.status) === JobStatus.NotStarted
            ? `${jobInfo.jobName}?tab=event`
            : jobInfo.jobName
        }
        tooltip={
          <div className="flex flex-row items-center justify-between gap-1.5">
            <p className="text-xs">查看 {jobInfo.jobName} 详情</p>
            {jobInfo.locked && (
              <TipBadge
                title={
                  jobInfo.permanentLocked
                    ? '长期锁定中'
                    : `锁定至 ${formatLockDate(jobInfo.lockedTimestamp)}`
                }
                className="text-primary bg-primary-foreground z-10"
              />
            )}
          </div>
        }
      />
    </div>
  )
}
