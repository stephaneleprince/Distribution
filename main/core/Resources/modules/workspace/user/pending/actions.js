import {url} from '#/main/core/api/router'

import {API_REQUEST} from '#/main/core/api/actions'
import {actions as listActions} from '#/main/core/data/list/actions'

export const actions = {}

actions.register = (users, workspace) => ({
  [API_REQUEST]: {
    url: url(['apiv2_workspace_registration_validate', {id: workspace.id}], {ids: users}),
    request: {
      method: 'PATCH'
    },
    success: (data, dispatch) => {
      dispatch(listActions.invalidateData('users.list'))
      dispatch(listActions.invalidateData('users.pending'))
    }
  }
})
