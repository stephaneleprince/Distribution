import {url} from '#/main/core/api/router'

import {API_REQUEST} from '#/main/core/api/actions'
import {actions as listActions} from '#/main/core/data/list/actions'
import {actions as formActions} from '#/main/core/data/form/actions'

export const actions = {}

actions.open = (formName, id = null, defaultProps) => {
  if (id) {
    return {
      [API_REQUEST]: {
        url: ['apiv2_user_get', {id}],
        success: (response, dispatch) => dispatch(formActions.resetForm(formName, response, false))
      }
    }
  } else {
    return formActions.resetForm(formName, defaultProps, true)
  }
}

actions.addGroups = (id, groups) => ({
  [API_REQUEST]: {
    url: url(['apiv2_user_add_groups', {id: id}], {ids: groups}),
    request: {
      method: 'PATCH'
    },
    success: (data, dispatch) => {
      dispatch(listActions.invalidateData('users.list'))
      dispatch(listActions.invalidateData('users.current.groups'))
    }
  }
})

actions.addRoles = (id, roles) => ({
  [API_REQUEST]: {
    url: url(['apiv2_user_add_roles', {id: id}], {ids: roles}),
    request: {
      method: 'PATCH'
    },
    success: (data, dispatch) => {
      dispatch(listActions.invalidateData('users.list'))
      dispatch(listActions.invalidateData('users.current.roles'))
    }
  }
})

actions.unregister = (users, workspace) => ({
  [API_REQUEST]: {
    url: url(['apiv2_workspace_unregister_users', {id: workspace.uuid}]) + '?'+ users.map(user => 'ids[]='+user.id).join('&'),
    request: {
      method: 'DELETE'
    },
    success: (data, dispatch) => {
      dispatch(listActions.invalidateData('users.list'))
    }
  }
})
