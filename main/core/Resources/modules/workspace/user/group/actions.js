import {url} from '#/main/core/api/router'

import {API_REQUEST} from '#/main/core/api/actions'
import {actions as listActions} from '#/main/core/data/list/actions'
import {actions as formActions} from '#/main/core/data/form/actions'

import {User as UserTypes} from '#/main/core/administration/user/user/prop-types'

export const actions = {}

actions.open = (formName, id = null, defaultProps) => {
  if (id) {
    return {
      [API_REQUEST]: {
        url: ['apiv2_group_get', {id}],
        success: (response, dispatch) => dispatch(formActions.resetForm(formName, response, false))
      }
    }
  } else {
    return formActions.resetForm(formName, defaultProps, true)
  }
}

actions.addRoles = (id, roles) => ({
  [API_REQUEST]: {
    url: url(['apiv2_group_add_roles', {id: id}], {ids: roles}),
    request: {
      method: 'PATCH'
    },
    success: (data, dispatch) => {
      dispatch(listActions.invalidateData('groups.list'))
      dispatch(listActions.invalidateData('groups.current.roles'))
    }
  }
})
