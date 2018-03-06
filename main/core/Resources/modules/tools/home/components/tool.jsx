import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/core/translation'
import {
  PageContainer,
  PageHeader,
  PageActions,
  PageAction
} from '#/main/core/layout/page'

const Tool = props =>
  <PageContainer>
    <PageHeader
      title={trans('home', {}, 'tools')}
    >
      <PageActions>
        <PageAction
          id="edit"
          title={trans('edit')}
          icon="fa fa-pencil"
          primary={true}
          action="#/edit"
        />
      </PageActions>
    </PageHeader>

  </PageContainer>

Tool.propTypes = {

}

export {
  Tool as HomeTool
}
