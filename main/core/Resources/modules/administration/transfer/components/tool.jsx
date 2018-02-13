import React from 'react'

import {trans} from '#/main/core/translation'
import {TabbedPageContainer} from '#/main/core/layout/tabs'

import {Import, ImportActions} from '#/main/core/administration/transfer/import/components/tab.jsx'
//import {Export, ExportActions} from '#/main/core/administration/transfer/export/components/tab.jsx'

const TransferTool = () =>
  <TabbedPageContainer
    title={trans('data_transfer', {}, 'tools')}
    redirect={[
      {from: '/', exact: true, to: '/import'}
    ]}

    tabs={[
      {
        icon: 'fa fa-upload',
        title: trans('import'),
        path: '/import/:entity?',
        actions: ImportActions,
        content: Import
      }/*, {
        icon: 'fa fa-download',
        title: trans('export'),
        path: '/export',
        actions: ExportActions,
        content: Export
      }*/
    ]}
  />

export {
  TransferTool
}
