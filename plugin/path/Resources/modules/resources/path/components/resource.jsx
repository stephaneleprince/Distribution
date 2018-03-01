import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/core/translation'
import {select as formSelect} from '#/main/core/data/form/selectors'
import {actions as formActions} from '#/main/core/data/form/actions'
import {RoutedPageContent} from '#/main/core/layout/router'
import {ResourcePageContainer} from '#/main/core/resource/containers/page.jsx'

import {select} from '#/plugin/path/resources/path/selectors'
import {Overview} from '#/plugin/path/resources/path/overview/components/overview.jsx'
import {Editor} from '#/plugin/path/resources/path/editor/components/editor.jsx'
import {Player} from '#/plugin/path/resources/path/player/components/player.jsx'

const Resource = props => {
  const redirect = []
  const routes = [
    {
      path: '/edit',
      component: Editor,
      canEnter: () => props.canEdit
    }, {
      path: '/play',
      component: Player
    }
  ]

  if (props.path.display.showOverview) {
    // add overview route
    routes.push({
      path: '/',
      exact: true,
      component: Overview
    })
  } else {
    // redirect to player
    redirect.push({
      from: '/',
      to: '/play',
      exact: true
    })
  }

  return (
    <ResourcePageContainer
      editor={{
        path: '/edit',
        save: {
          disabled: !props.saveEnabled,
          action: () => props.saveForm(props.path.id)
        }
      }}
      customActions={[
        {
          icon: 'fa fa-fw fa-home',
          label: trans('show_overview'),
          displayed: props.path.display.showOverview,
          action: '#/'
        }, {
          icon: 'fa fa-fw fa-play',
          label: trans('start_path', {}, 'path'),
          action: '#/play'
        }
      ]}
    >
      <RoutedPageContent
        headerSpacer={false}
        redirect={redirect}
        routes={routes}
      />
    </ResourcePageContainer>
  )
}

Resource.propTypes = {
  path: T.object.isRequired,
  editorOpened: T.bool.isRequired,
  saveEnabled: T.bool.isRequired,

  saveForm: T.func.isRequired
}

const PathResource = connect(
  (state) => ({
    path: select.path(state),
    editorOpened: !isEmpty(formSelect.data(formSelect.form(state, 'pathForm'))),
    saveEnabled: formSelect.saveEnabled(formSelect.form(state, 'pathForm'))
  }),
  (dispatch) => ({
    saveForm: (pathId) => dispatch(formActions.saveForm('pathForm', ['apiv2_path_update', {id: pathId}]))
  })
)(Resource)

export {
  PathResource
}
