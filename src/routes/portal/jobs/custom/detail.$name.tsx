import { createFileRoute } from '@tanstack/react-router'

import { Base } from '@/components/job/detail'

export const Route = createFileRoute('/portal/jobs/custom/detail/$name')({
  component: RouteComponent,
})

function RouteComponent() {
  const name = Route.useParams().name
  return <Base name={name} />
}
