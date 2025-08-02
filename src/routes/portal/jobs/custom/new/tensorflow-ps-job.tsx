import { createFileRoute } from '@tanstack/react-router'

import { publishValidateSearch } from '@/components/job/publish'

export const Route = createFileRoute('/portal/jobs/custom/new/tensorflow-ps-job')({
  validateSearch: publishValidateSearch,
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/portal/jobs/custom/new/tfjob"!</div>
}
