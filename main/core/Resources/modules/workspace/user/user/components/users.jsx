import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {t, Translator} from '#/main/core/translation'
import {generateUrl} from '#/main/core/api/router'

import {DataListContainer} from '#/main/core/data/list/containers/data-list.jsx'
import Configuration from '#/main/core/library/Configuration/Configuration'

import {actions as modalActions} from '#/main/core/layout/modal/actions'
import {MODAL_ADD_ROLES} from '#/main/core/workspace/user/modals/components/add-roles.jsx'
import {UserList} from '#/main/core/workspace/user/user/components/user-list.jsx'

import {select} from '#/main/core/workspace/user/selectors'

const UsersList = props =>
  <DataListContainer
    name="users.list"
    open={UserList.open}
    fetch={{
      url: ['apiv2_workspace_list_users', {id: props.workspace.uuid}],
      autoload: true
    }}
  actions={[
    {
      icon: 'fa fa-fw fa-id-card-o',
      label: t('add_role'),
      action: (rows) => props.addRoles(rows, props.workspace.roles)
    }]}
    definition={UserList.definition}
    card={UserList.card}
  />

UsersList.propTypes = {
}

const Users = connect(
  state => ({workspace: select.workspace(state)}),
  dispatch => ({
    addRoles(users, roles) {
      dispatch(
        modalActions.showModal(MODAL_ADD_ROLES, {
          addRoles: (roles) => dispatch(userActions.addRoles(users, roles)),
          roles: roles
        })
      )
    }
  })
)(UsersList)

export {
  Users
}
