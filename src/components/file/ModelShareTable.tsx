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
  QueueDataset,
  UserDataset,
  cancelSharedQueueResp,
  cancelSharedUserResp,
} from '@/services/api/dataset'
import { IResponse } from '@/services/types'

import { SharedResourceTable } from './SharedResourceTable'

interface DatesetShareTableProps {
  resourceType: 'model' | 'dataset' | 'sharefile'
  apiShareDatasetwithUser: (ud: UserDataset) => Promise<IResponse<string>>
  apiShareDatasetwithQueue: (qd: QueueDataset) => Promise<IResponse<string>>
  apiCancelDatasetSharewithUser: (csu: cancelSharedUserResp) => Promise<IResponse<string>>
  apiCancelDatasetSharewithQueue: (csq: cancelSharedQueueResp) => Promise<IResponse<string>>
  apiDatasetDelete: (datasetID: number) => Promise<IResponse<string>>
}

export function ModelShareTable(props: DatesetShareTableProps) {
  return <SharedResourceTable {...props} />
}
