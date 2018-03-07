import React from 'react'
import {PropTypes as T} from 'prop-types'

import Modal from 'react-bootstrap/lib/Modal'

import {trans} from '#/main/core/translation'
import {BaseModal} from '#/main/core/layout/modal/components/base'

const MODAL_ADD_WIDGET = 'MODAL_ADD_WIDGET'

const AddWidgetModal = props =>
  <BaseModal
    {...props}
    icon="fa fa-fw fa-plus"
    title={trans('add_widget', {}, 'home')}
    bsSize="lg"
  >
    <Modal.Body>
      COUCOU
    </Modal.Body>
  </BaseModal>

AddWidgetModal.propTypes = {
  selectType: T.func.isRequired
}

export {
  MODAL_ADD_WIDGET,
  AddWidgetModal
}
