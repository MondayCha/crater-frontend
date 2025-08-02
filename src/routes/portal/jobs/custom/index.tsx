import { createFileRoute } from '@tanstack/react-router'
import { useAtomValue } from 'jotai'

import VolcanoOverview from '@/components/job/overview/custom-jobs'
import ColocateOverview from '@/components/job/overview/emias-jobs'

import { globalJobUrl } from '@/utils/store'

export const Route = createFileRoute('/portal/jobs/custom/')({
  component: RouteComponent,
})

function RouteComponent() {
  const jobType = useAtomValue(globalJobUrl)
  return jobType === 'aijobs' ? <ColocateOverview /> : <VolcanoOverview />
}
