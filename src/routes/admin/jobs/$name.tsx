import { createFileRoute } from '@tanstack/react-router'

import { Base } from '@/components/job/detail'
import { detailValidateSearch } from '@/components/layout/detail-page'

export const Route = createFileRoute('/admin/jobs/$name')({
  validateSearch: detailValidateSearch,
  component: RouteComponent,
})

function RouteComponent() {
  const jobName = Route.useParams().name
  const { tab } = Route.useSearch()
  const navigate = Route.useNavigate()
  return (
    <Base
      name={jobName}
      currentTab={tab}
      setCurrentTab={(tab) => navigate({ to: '.', search: { tab } })}
    />
  )
}
