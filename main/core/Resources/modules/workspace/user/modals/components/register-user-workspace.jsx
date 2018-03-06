import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/core/translation'
import {ConfirmModal} from '#/main/core/layout/modal/components/confirm.jsx'

const MODAL_REGISTER_USER_WORKSPACE = 'MODAL_REGISTER_USER_WORKSPACE'

const RegisterUserWorkspaceModal = props =>
  <ConfirmModal
    {...props}
    icon="fa fa-fw fa-lock"
    title={trans('register')}
    confirmButtonText={trans('register')}
    dangerous={false}
    question={trans('register_users')}
    isHtml={false}
    handleConfirm={() => {alert('okay')}}
    fadeModal={() => {alert('pas okay')}}
  />

RegisterUserWorkspaceModal.propTypes = {
  register: T.func,
  users: T.array,
  workspace: T.object
}

export {
  MODAL_REGISTER_USER_WORKSPACE,
  RegisterUserWorkspaceModal
}
