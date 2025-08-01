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
// i18n-processed-v1.1.0
// Modified code
import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { DataTableFacetedFilter, DataTableFacetedFilterOption } from './DataTableFacetedFilter'
import { DataTableViewOptions } from './DataTableViewOptions'

export interface DataTableToolbarConfig {
  searchKey: string
  filterOptions: {
    key: string
    title: string
    option: DataTableFacetedFilterOption[]
  }[]
  getHeader: (key: string) => string
}

interface DataTableToolbarProps<TData> extends React.HTMLAttributes<HTMLDivElement> {
  table: Table<TData>
  config: DataTableToolbarConfig
}

export function DataTableToolbar<TData>({
  table,
  config: { searchKey, filterOptions, getHeader },
  children,
}: DataTableToolbarProps<TData>) {
  const { t } = useTranslation()
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-row items-center space-x-2">
        {children}
        <div className="relative ml-auto h-8 flex-1 md:grow-0">
          <Search className="text-muted-foreground absolute top-2 left-2 size-4" />
          <Input
            placeholder={`${t('dataTableToolbar.searchPlaceholder')} ${getHeader(searchKey)}`}
            value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn(searchKey)?.setFilterValue(event.target.value)}
            className="bg-background h-8 w-[150px] pl-8 lg:w-[250px]"
          />
        </div>
        {filterOptions.map(
          (filterOption) =>
            table.getColumn(filterOption.key) && (
              <DataTableFacetedFilter
                key={filterOption.key}
                column={table.getColumn(filterOption.key)}
                title={filterOption.title}
                options={filterOption.option}
              />
            )
        )}
        {isFiltered && (
          <Button
            variant="outline"
            size="icon"
            title={t('dataTableToolbar.clearFilters')}
            type="button"
            onClick={() => table.resetColumnFilters()}
            className="h-8 w-8 border-dashed"
          >
            <Cross2Icon className="size-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} getHeader={getHeader} />
    </div>
  )
}

export function DataTableToolbarRight<TData>({
  table,
  config: { searchKey, filterOptions, getHeader },
}: DataTableToolbarProps<TData>) {
  const { t } = useTranslation()
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex flex-row items-center justify-end gap-2">
      {isFiltered && (
        <Button
          variant="outline"
          size="icon"
          title={t('dataTableToolbar.clearFilters')}
          type="button"
          onClick={() => table.resetColumnFilters()}
          className="h-7 w-7 border-dashed"
        >
          <Cross2Icon className="size-4" />
        </Button>
      )}
      {filterOptions.map(
        (filterOption) =>
          table.getColumn(filterOption.key) && (
            <DataTableFacetedFilter
              key={filterOption.key}
              column={table.getColumn(filterOption.key)}
              title={filterOption.title}
              options={filterOption.option}
            />
          )
      )}
      <div className="relative ml-auto h-8">
        <Search className="text-muted-foreground absolute top-2 left-2 size-4" />
        <Input
          placeholder={`${t('dataTableToolbar.searchPlaceholder')} ${getHeader(searchKey)}`}
          value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn(searchKey)?.setFilterValue(event.target.value)}
          className="bg-background h-8 w-[150px] pl-8 lg:w-[250px]"
        />
      </div>
      <DataTableViewOptions table={table} getHeader={getHeader} />
    </div>
  )
}
