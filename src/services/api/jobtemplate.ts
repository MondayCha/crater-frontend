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
import { apiDelete, apiGet, apiPost, apiPut } from '@/services/client'
import { IResponse } from '@/services/types'

import { IUserInfo } from './vcjob'

export interface JobTemplate {
  id: number
  name: string
  describe: string
  document: string
  createdAt: string
  template: string
  userInfo: IUserInfo
}
export interface JobTemplateReq {
  describe: string
  name: string
  document: string
  template: string
}
export const listJobTemplate = () => {
  return apiGet<IResponse<JobTemplate[]>>(`/jobtemplate/list`)
}
export const createJobTemplate = (data: JobTemplateReq) => {
  return apiPost<IResponse<string>>(`/jobtemplate/create`, data)
}
export const getJobTemplate = (id: number) => {
  return apiGet<IResponse<JobTemplate>>(`/jobtemplate/${id}`)
}
export const deleteJobTemplate = (id: number) => {
  return apiDelete<IResponse<string>>(`/jobtemplate/delete/${id}`)
}
export const updateJobTemplate = (data: JobTemplateReq & { id: number }) => {
  return apiPut<IResponse<string>>(`/jobtemplate/update/${data.id}`, data)
}
