import {generateUrl} from '#/main/core/api/router'

import {API_REQUEST} from '#/main/core/api/actions'
import {actions as formActions} from '#/main/core/data/form/actions'
import {actions as listActions} from '#/main/core/data/list/actions'

import {Role as RoleTypes} from '#/main/core/administration/user/role/prop-types'

export const actions = {}

actions.open = (formName, id = null, defaultValue) => (dispatch) => {
  if (id) {
    dispatch({
      [API_REQUEST]: {
        url: ['apiv2_role_get', {id}],
        success: (response, dispatch) => {
          dispatch(formActions.resetForm(formName, response, false))
        }
      }
    })
  } else {
    dispatch(formActions.resetForm(formName, defaultValue, true))
  }
}
