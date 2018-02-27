import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {t} from '#/main/core/translation'
import {navigate, matchPath, Routes, withRouter} from '#/main/core/router'

import {PageActions} from '#/main/core/layout/page/components/page-actions.jsx'
import {FormPageActionsContainer} from '#/main/core/data/form/containers/page-actions.jsx'

import {FormContainer} from '#/main/core/data/form/containers/form.jsx'
import {FormSections, FormSection} from '#/main/core/layout/form/components/form-sections.jsx'
import {select as formSelect} from '#/main/core/data/form/selectors'
import {DataListContainer} from '#/main/core/data/list/containers/data-list.jsx'
import {actions as modalActions} from '#/main/core/layout/modal/actions'

import {RoleList} from '#/main/core/administration/user/role/components/role-list.jsx'

import {select} from '#/main/core/workspace/user/selectors'
import {actions} from '#/main/core/administration/user/group/actions'

const RoleTabComponent = props =>
    <DataListContainer
      name="users.list"
      open={RoleList.open}
      fetch={{
        url: ['apiv2_workspace_list_roles', {id: props.workspace.uuid}],
        autoload: true
      }}
      delete={{
        url: ['apiv2_workspace_remove_roles', {id: props.workspace.uuid}]
      }}
      definition={RoleList.definition}
      card={RoleList.card}
    />

const RoleTab = connect(
  state => ({workspace: select.workspace(state)}),
  null
)(RoleTabComponent)

export {
  RoleTab
}