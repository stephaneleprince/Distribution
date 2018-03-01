import React from 'react'
import {PropTypes as T} from 'prop-types'

import {t} from '#/main/core/translation'
import {DataFormModal} from '#/main/core/data/form/modals/components/data-form.jsx'

const MODAL_ADD_ROLES = 'MODAL_ADD_ROLES'

function getRoleEnum(roles) {
  const data = {}

  roles.forEach(role => {
    if (role.id) {
      data[role.id] = role.translationKey
    } else {
      data[role.uuid] = role.translationKey
    }
  })

  return data
}

const AddRolesModal = props =>
  <DataFormModal
    {...props}
    icon="fa fa-fw fa-id-card-o"
    title={t('add_roles')}
    save={(data) => props.addRoles(data.plainPassword)}
    sections={[
      {
        id: 'general',
        title: t('general'),
        primary: true,
        fields: [
          {
            name: 'roles',
            type: 'enum',
            label: t('roles'),
            options: {
              multiple: true,
              condensed: false,
              choices: getRoleEnum(props.roles)
            }
          }
        ]
      }
    ]}
  />

AddRolesModal.propTypes = {
  addRoles: T.func.isRequired,
  roles: T.array.isRequired
}

export {
  MODAL_ADD_ROLES,
  AddRolesModal
}
