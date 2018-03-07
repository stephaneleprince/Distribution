import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/core/translation'
import {navigate, matchPath, withRouter} from '#/main/core/router'
import {
  PageHeader,
  PageActions
} from '#/main/core/layout/page'
import {
  RoutedPageContainer,
  RoutedPageContent
} from '#/main/core/layout/router'
import {FormPageActionsContainer} from '#/main/core/data/form/containers/page-actions.jsx'

import {Editor} from '#/main/core/tools/home/editor/components/editor'

const ToolActionsComponent = props =>
  <PageActions>
    <FormPageActionsContainer
      formName="editor"
      target={['apiv2_home_update']}
      opened={!!matchPath(props.location.pathname, {path: '/edit'})}
      open={{
        action: '#/edit'
      }}
      cancel={{
        action: () => navigate('/')
      }}
    />
  </PageActions>

ToolActionsComponent.propTypes = {
  location: T.shape({
    pathname: T.string
  }).isRequired
}

const ToolActions = withRouter(ToolActionsComponent)

const Tool = props =>
  <RoutedPageContainer>
    <PageHeader
      title={trans('desktop')}
    >
      <ToolActions />
    </PageHeader>

    <RoutedPageContent
      headerSpacer={true}
      routes={[
        {
          path: '/',
          exact: true,
          render: () => (<span>Player</span>)
        }, {
          path: '/edit',
          exact: true,
          component: Editor
        }
      ]}
    />
  </RoutedPageContainer>

Tool.propTypes = {

}

export {
  Tool as HomeTool
}
