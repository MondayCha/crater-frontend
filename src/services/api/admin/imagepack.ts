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
import { apiGet, apiPost } from '@/services/client'
import { IResponse } from '@/services/types'

import {
  ListImageResponse,
  ListKanikoResponse,
  UpdateDescription,
  UpdateTaskType,
} from '../imagepack'

// export const apiAdminImagepackCreate = async (imagepack: KanikoCreate) => {
//   const response = await apiPost<IResponse<string>>(
//     VERSION + "/admin/images/create",
//     imagepack,
//   );
//   return response.data;
// };

// export const apiAdminImagePackList = (type: number) =>
//   apiGet<IResponse<ImagePackListResponse>>(
//     `/admin/images/list?type=${type}`,
//   );

// export const apiAdminImagePackDelete = async (id: number) => {
//   const response = await apiPost<IResponse<string>>(
//     VERSION + "/admin/images/delete",
//     id,
//   );
//   return response.data;
// };

// export interface UpdateImagePublicStatusRequest {
//   id: number;
//   imagetype: number;
// }

export const apiAdminImagePublicStatusChange = async (id: number) => {
  const response = await apiPost<IResponse<string>>('/admin/images/change', id)
  return response.data
}

export const apiAdminListImage = () => apiGet<IResponse<ListImageResponse>>(`/admin/images/image`)

export const apiAdminDeleteKanikoList = (idList: number[]) =>
  apiPost<IResponse<string>>(`/admin/images/deletekaniko`, {
    idList,
  })

export const apiAdminListKaniko = () =>
  apiGet<IResponse<ListKanikoResponse>>(`/admin/images/kaniko`)

export const apiAdminDeleteImageList = (idList: number[]) =>
  apiPost<IResponse<string>>(`/admin/images/deleteimage`, {
    idList,
  })

export const apiAdminChangeImagePublicStatus = (id: number) =>
  apiPost<IResponse<string>>(`/admin/images/change/${id}`)

export const apiAdminChangeImageDescription = (data: UpdateDescription) =>
  apiPost<IResponse<string>>(`/admin/images/description`, data)

export const apiAdminChangeImageTaskType = (data: UpdateTaskType) =>
  apiPost<IResponse<string>>(`/admin/images/type`, data)
