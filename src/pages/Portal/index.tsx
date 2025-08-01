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
// i18n-processed-v1.1.0 (no translatable strings)
import {
  BarChartBigIcon,
  BoxIcon,
  DatabaseIcon,
  FlaskConicalIcon,
  FolderIcon,
  SettingsIcon,
  ShoppingBagIcon,
  SquareChartGanttIcon,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Navigate, RouteObject } from 'react-router-dom'

import DashboardLayout from '@/components/layout/Dashboard'
import NotFound from '@/components/layout/NotFound'
import { NavGroupProps } from '@/components/sidebar/types'

import AuthedRouter from './AuthedRouter'
import { datasetRoutes, modelRoutes, shareFileRoutes } from './Data'
import batchRoutes from './Job/Batch'
import interactiveRoutes from './Job/Interactive'
import UserSettings from './Setting/UserSetting'

const portalRoutes: RouteObject[] = [
  {
    path: 'job',
    children: [
      {
        path: 'inter/*',
        children: interactiveRoutes,
      },
      {
        path: 'batch/*',
        children: batchRoutes,
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
        children: datasetRoutes,
      },
      {
        path: 'model/*',
        children: modelRoutes,
      },
      {
        path: 'sharefile/*',
        children: shareFileRoutes,
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
    path: 'account',
    children: [
      {
        path: 'member',
      },
    ],
  },
  {
    path: 'setting',
    children: [
      {
        path: 'user',
        element: <UserSettings />,
      },
    ],
  },
]

// 使用 hook 获取翻译版的侧边栏组
const useUserSidebarGroups = (): NavGroupProps[] => {
  const { t } = useTranslation()

  return [
    {
      title: t('sidebar.resourceAndMonitoring'),
      items: [
        {
          title: t('navigation.platformOverview'),
          url: 'overview',
          icon: SquareChartGanttIcon,
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
              title: t('navigation.freeResources'),
              url: 'monitor/node',
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
          title: t('navigation.myJobs'),
          icon: FlaskConicalIcon,
          items: [
            {
              title: t('navigation.customJobs'),
              url: 'job/batch',
            },
            {
              title: t('navigation.jupyterLab'),
              url: 'job/inter',
            },
          ],
        },
        {
          title: t('navigation.jobTemplates'),
          url: 'modal',
          icon: ShoppingBagIcon,
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
          items: [
            {
              title: t('navigation.datasets'),
              url: 'data/dataset',
            },
            {
              title: t('navigation.models'),
              url: 'data/model',
            },
            {
              title: t('navigation.sharedFiles'),
              url: 'data/sharefile',
            },
          ],
        },
        {
          title: t('navigation.fileManagement'),
          icon: FolderIcon,
          items: [
            {
              title: t('navigation.spaceFile'),
              url: 'files/spacefile',
            },
          ],
        },
      ],
    },
    {
      title: t('sidebar.others'),
      items: [
        {
          title: t('navigation.settings'),
          icon: SettingsIcon,
          items: [
            {
              title: t('navigation.userSettings'),
              url: 'setting/user',
            },
          ],
        },
      ],
    },
  ]
}

export const portalRoute: RouteObject = {
  path: '/portal',
  element: (
    <AuthedRouter>
      <DashboardLayoutWrapper />
    </AuthedRouter>
  ),
  children: [
    {
      index: true,
      element: <Navigate to="overview" replace />,
    },
    ...portalRoutes,
    {
      path: '*',
      element: <NotFound />,
    },
  ],
}

// Create a wrapper component to use the hook
function DashboardLayoutWrapper() {
  const groups = useUserSidebarGroups()
  return <DashboardLayout groups={groups} />
}
