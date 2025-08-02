import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/portal/jobs/inter/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/portal/jobs/inter/"!</div>
}
