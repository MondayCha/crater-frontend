import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import { RouterAuthState } from '@/hooks/use-auth'

interface RouterContext {
  auth: RouterAuthState
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools position="bottom-left" initialIsOpen={false} />
    </>
  ),
})
