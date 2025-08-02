import { createFileRoute } from '@tanstack/react-router'

import NvidiaOverview from '@/components/monitors/nvidia-monitor'

export const Route = createFileRoute('/portal/monitor/gpu')({
  component: RouteComponent,
})

function RouteComponent() {
  return <NvidiaOverview />
}
