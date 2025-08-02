import { Outlet, createFileRoute, redirect, useLocation } from '@tanstack/react-router'
import {
  AlarmClockIcon,
  BarChartBigIcon,
  BoxIcon,
  DatabaseIcon,
  FlaskConicalIcon,
  FolderIcon,
  ServerIcon,
  SettingsIcon,
  UserRoundIcon,
  UsersRoundIcon,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

import AppLayout from '@/components/layout/app-layout'
import { NavGroupProps } from '@/components/sidebar/types'

import { Role } from '@/services/api/auth'

export const Route = createFileRoute('/admin')({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated || context.auth.context?.rolePlatform !== Role.Admin) {
      throw redirect({
        to: '/auth',
        search: {
          // Save current location for redirect after login
          redirect: location.href,
        },
      })
    }
  },
  component: RouteComponent,
})

const useAdminSidebarGroups = (): NavGroupProps[] => {
  const { t } = useTranslation()

  return [
    {
      title: t('sidebar.resourceAndMonitoring'),
      items: [
        {
          title: t('navigation.resourceManagement'),
          icon: ServerIcon,
          items: [
            {
              title: t('navigation.nodeManagement'),
              url: 'cluster/nodes',
            },
            {
              title: t('navigation.resourceManagement'),
              url: 'cluster/resources',
            },
          ],
        },
        {
          title: t('navigation.clusterMonitoring'),
          icon: BarChartBigIcon,
          items: [
            {
              title: t('navigation.gpuMonitoring'),
              url: 'monitor/gpu',
            },
            {
              title: t('navigation.networkMonitoring'),
              url: 'monitor/network',
            },
          ],
        },
      ],
    },
    {
      title: t('sidebar.jobsAndServices'),
      items: [
        {
          title: t('navigation.jobManagement'),
          url: 'jobs',
          icon: FlaskConicalIcon,
        },
        {
          title: t('navigation.cronPolicy'),
          url: 'cronjobs',
          icon: AlarmClockIcon,
        },
      ],
    },
    {
      title: t('sidebar.usersAndAccounts'),
      items: [
        {
          title: t('navigation.userManagement'),
          url: 'user',
          icon: UserRoundIcon,
        },
        {
          title: t('navigation.accountManagement'),
          url: 'account',
          icon: UsersRoundIcon,
        },
      ],
    },
    {
      title: t('sidebar.dataAndImages'),
      items: [
        {
          title: t('navigation.imageManagement'),
          icon: BoxIcon,
          items: [
            {
              title: t('navigation.imageCreation'),
              url: 'image/createimage',
            },
            {
              title: t('navigation.imageList'),
              url: 'image/uploadimage',
            },
          ],
        },
        {
          title: t('navigation.dataManagement'),
          icon: DatabaseIcon,
          url: 'data/dataset',
        },
        {
          title: t('navigation.fileManagement'),
          icon: FolderIcon,
          url: 'files/spacefile',
        },
      ],
    },
    {
      title: t('navigation.settings'),
      items: [
        {
          title: t('navigation.platformSettings'),
          icon: SettingsIcon,
          url: 'setting',
        },
      ],
    },
  ]
}

function RouteComponent() {
  const groups = useAdminSidebarGroups()
  const pathname = useLocation({
    select: (location) => location.pathname,
  })

  return (
    <AppLayout groups={groups} rawPath={pathname}>
      <Outlet />
    </AppLayout>
  )
}
