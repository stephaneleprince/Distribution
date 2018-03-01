import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {t} from '#/main/core/translation'
import {navigate, matchPath, Routes, withRouter} from '#/main/core/router'

import {PageActions} from '#/main/core/layout/page/components/page-actions.jsx'
import {FormPageActionsContainer} from '#/main/core/data/form/containers/page-actions.jsx'

import {Group}    from '#/main/core/administration/user/group/components/group.jsx'
import {Groups}   from '#/main/core/workspace/user/group/components/group-list.jsx'
import {actions} from '#/main/core/workspace/user/user/actions'
import {select}  from '#/main/core/workspace/user/selectors'

const GroupTabActionsComponent = props =>
  <PageActions>
    <FormPageActionsContainer
      formName="groups.current"
      target={(user, isNew) => isNew ?
        ['apiv2_group_create'] :
        ['apiv2_group_update', {id: user.id}]
      }
      opened={!!matchPath(props.location.pathname, {path: '/groups/form'})}
      open={{
        icon: 'fa fa-plus',
        label: t('add_group'),
        action: '#/groups/form'
      }}
      cancel={{
        action: () => navigate('/groups')
      }}
    />
  </PageActions>

GroupTabActionsComponent.propTypes = {
}

const GroupTabActions = withRouter(GroupTabActionsComponent)

const GroupTabComponent = props =>
  <Routes
    routes={[
      {
        path: '/groups',
        exact: true,
        component: Groups
      }, {
        path: '/groups/form/:id?',
        component: Group,
        onEnter: (params) => props.openForm(params.id || null, props.workspace, props.restrictions)
      }
    ]}
  />

GroupTabComponent.propTypes = {
  openForm: T.func.isRequired
}

const GroupTab = connect(
  state => ({
    workspace: select.workspace(state),
    restrictions: select.restrictions(state),
    collaboratorRole: select.collaboratorRole(state)
  }),
  dispatch => ({
    openForm(id = null, workspace, restrictions, collaboratorRole) {

      const defaultValue = {
        organization: null, //retreive it with axel stuff
        roles: [collaboratorRole]
      }
    }
  })
)(GroupTabComponent)

export {
  GroupTabActions,
  GroupTab
}
