import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {t, Translator} from '#/main/core/translation'
import {generateUrl} from '#/main/core/api/router'

import {DataListContainer} from '#/main/core/data/list/containers/data-list.jsx'
import Configuration from '#/main/core/library/Configuration/Configuration'

import {actions as modalActions} from '#/main/core/layout/modal/actions'
import {MODAL_CHANGE_PASSWORD} from '#/main/core/user/modals/components/change-password.jsx'
import {MODAL_URL} from '#/main/core/layout/modal'

import {select} from '#/main/core/workspace/user/selectors'
import {RoleList} from '#/main/core/administration/user/role/components/role-list.jsx'

const RolesList = props =>
  <DataListContainer
    name="roles.list"
    open={RoleList.open}
    fetch={{
      url: ['apiv2_workspace_list_roles', {id: props.workspace.uuid}],
      autoload: true
    }}
    actions={[]}
    definition={RoleList.definition}
    card={RoleList.card}
  />

RolesList.propTypes = {
}

const Roles = connect(
  state => ({workspace: select.workspace(state)}),
  null
)(RolesList)

export {
  Roles
}
