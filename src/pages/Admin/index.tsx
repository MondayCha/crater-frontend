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
// ignore-i18n-script
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
import { FC, PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, RouteObject } from 'react-router-dom'

import DashboardLayout from '@/components/layout/Dashboard'
import NotFound from '@/components/layout/NotFound'
import NetworkOverview from '@/components/monitors/network-monitor'
import NvidiaOverview from '@/components/monitors/nvidia-monitor'
import { NavGroupProps } from '@/components/sidebar/types'

import { Role } from '@/services/api/auth'

import { useAuth } from '@/hooks/useAuth'

import SystemSetting from '../Portal/Setting/SystemSetting'
import admindatasetRoutes from './Data'

const routeItems: RouteObject[] = [
  {
    path: 'monitor',
    children: [
      {
        path: 'network',
        element: <NetworkOverview />,
      },
      {
        path: 'gpu',
        element: <NvidiaOverview />,
      },
    ],
  },
  {
    path: 'account/*',
    children: [
      {
        index: true,
        lazy: () => import('./Account'),
      },
      {
        path: ':id',
        lazy: () => import('./Account/Detail'),
      },
    ],
  },
  {
    path: 'image',
    children: [
      {
        path: 'createimage/*',
        lazy: () => import('./Image/Registry'),
      },
      {
        path: 'uploadimage/*',
        lazy: () => import('./Image/Image'),
      },
    ],
  },
  {
    path: 'data',
    children: [
      {
        path: 'dataset/*',
        children: admindatasetRoutes,
      },
    ],
  },
  {
    path: 'files',
    children: [
      {
        path: 'spacefile/*',
        lazy: () => import('./Data/FileSystem'),
      },
    ],
  },
  {
    path: 'setting',
    element: <SystemSetting />,
  },
]

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
              url: 'cluster/node',
            },
            {
              title: t('navigation.resourceManagement'),
              url: 'cluster/resource',
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
          url: 'job',
          icon: FlaskConicalIcon,
        },
        {
          title: t('navigation.cronPolicy'),
          url: 'cron',
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

const AuthedRouter: FC<PropsWithChildren> = ({ children }) => {
  const isAuthenticated = useAuth(Role.Admin)
  return isAuthenticated ? children : <Navigate to="/portal" replace />
}

export const adminRoute: RouteObject = {
  path: '/admin',
  element: (
    <AuthedRouter>
      <DashboardLayoutWrapper />
    </AuthedRouter>
  ),
  children: [
    {
      index: true,
      element: <Navigate to="cluster/node" replace={true} />,
    },
    ...routeItems,
    {
      path: '*',
      element: <NotFound />,
    },
  ],
}

function DashboardLayoutWrapper() {
  const groups = useAdminSidebarGroups()
  return <DashboardLayout groups={groups} />
}
