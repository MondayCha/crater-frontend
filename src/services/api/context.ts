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
import { apiGet, apiPost, apiPut } from '@/services/client'

import { globalSettings, store } from '@/utils/store'

import { IResponse } from '../types'
import { IUserAttributes } from './admin/user'

interface ResourceBase {
  amount: number
  format: string
}

export interface ResourceResp {
  label: string
  allocated?: ResourceBase
  guarantee?: ResourceBase
  deserved?: ResourceBase
  capability?: ResourceBase
}

export interface QuotaResp {
  cpu: ResourceResp
  memory: ResourceResp
  gpus: ResourceResp[]
}

const { scheduler } = store.get(globalSettings)

export const apiContextQuota = () => {
  const url = scheduler === 'volcano' ? '/context/quota' : '/aijobs/quota'
  return apiGet<IResponse<QuotaResp>>(url)
}

export const apiContextUpdateUserAttributes = (data: IUserAttributes) =>
  apiPut<IResponse<string>>(`/context/attributes`, data)

// apiSendVerificationEmail,
// apiVerifyEmailCode,

export const apiSendVerificationEmail = (email: string) =>
  apiPost<IResponse<string>>(`/context/email/code`, { email })

export const apiVerifyEmailCode = (email: string, code: string) =>
  apiPost<IResponse<string>>(`/context/email/update`, {
    code,
    email,
  })
