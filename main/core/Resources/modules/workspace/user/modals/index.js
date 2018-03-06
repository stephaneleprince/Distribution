import {registerModals} from '#/main/core/layout/modal'

// user modals
import {MODAL_ADD_ROLES, AddRolesModal} from '#/main/core/workspace/user/modals/components/add-roles.jsx'
import {MODAL_REGISTER_USER_WORKSPACE, RegisterUserWorkspaceModal} from '#/main/core/workspace/user/modals/components/register-user-workspace.jsx'

// register user modals
registerModals([
  [MODAL_ADD_ROLES, AddRolesModal],
  [MODAL_REGISTER_USER_WORKSPACE, RegisterUserWorkspaceModal]
])

export {
  MODAL_ADD_ROLES,
  MODAL_REGISTER_USER_WORKSPACE
}
