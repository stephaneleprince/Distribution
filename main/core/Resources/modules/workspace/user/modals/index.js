import {registerModals} from '#/main/core/layout/modal'

// user modals
import {MODAL_ADD_ROLES, AddRolesModal} from '#/main/core/workspace/user/modals/components/add-roles.jsx'

// register user modals
registerModals([
  [MODAL_ADD_ROLES, AddRolesModal]
])

export {
  MODAL_ADD_ROLES
}
