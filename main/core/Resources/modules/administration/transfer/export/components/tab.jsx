import React from 'react'

import {trans} from '#/main/core/translation'
import {PageActions, PageAction} from '#/main/core/layout/page/components/page-actions.jsx'

const ExportActions = () =>
  <PageActions>
    <PageAction
      id="execute-action"
      icon="fa fa-floppy-o"
      title={trans('export')}
      action="#"
    />
  </PageActions>

const Export = () =>
  <div>
    //??
  </div>

export {
  ExportActions,
  Export
}
