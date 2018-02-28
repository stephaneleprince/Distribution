import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import classes from 'classnames'

import {t, trans} from '#/main/core/translation'

import {FormContainer} from '#/main/core/data/form/containers/form.jsx'
import {FormSections, FormSection} from '#/main/core/layout/form/components/form-sections.jsx'
import {DataListContainer} from '#/main/core/data/list/containers/data-list.jsx'
import {Checkbox} from '#/main/core/layout/form/components/field/checkbox.jsx'
import {select as formSelect} from '#/main/core/data/form/selectors'
import {actions as formActions} from '#/main/core/data/form/actions'
import {actions as modalActions} from '#/main/core/layout/modal/actions'
import {MODAL_DATA_PICKER} from '#/main/core/data/list/modals'

import {enumRole, PLATFORM_ROLE} from '#/main/core/user/role/constants'
import {Role as RoleTypes} from '#/main/core/administration/user/role/prop-types'
import {actions} from '#/main/core/administration/user/role/actions'
import {GroupList} from '#/main/core/administration/user/group/components/group-list.jsx'
import {UserList} from '#/main/core/administration/user/user/components/user-list.jsx'

const RoleForm = props =>
  <FormContainer
    level={3}
    name="roles.current"
    sections={[
      {
        id: 'general',
        title: t('general'),
        primary: true,
        fields: [
          {
            name: 'translationKey',
            type: 'translation',
            label: t('name'),
            required: true,
            disabled: props.role.meta && props.role.meta.readOnly
          },
        ],
      }
    ]}
  >
  </FormContainer>

RoleForm.propTypes = {
  new: T.bool.isRequired,
  role: T.shape(
    RoleTypes.propTypes
  ).isRequired,
  updateProp: T.func.isRequired,
  pickUsers: T.func.isRequired,
  pickGroups: T.func.isRequired
}

const Role = connect(
  state => ({
    new: formSelect.isNew(formSelect.form(state, 'roles.current')),
    role: formSelect.data(formSelect.form(state, 'roles.current'))
  }),
  dispatch => ({
    updateProp(propName, propValue) {
      dispatch(formActions.updateProp('roles.current', propName, propValue))
    }
  })
)(RoleForm)

export {
  Role
}
