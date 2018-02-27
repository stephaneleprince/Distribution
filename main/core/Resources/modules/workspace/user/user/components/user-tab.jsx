import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {t} from '#/main/core/translation'
import {navigate, matchPath, Routes, withRouter} from '#/main/core/router'

import {PageActions} from '#/main/core/layout/page/components/page-actions.jsx'
import {FormPageActionsContainer} from '#/main/core/data/form/containers/page-actions.jsx'

import {Group}   from '#/main/core/administration/user/group/components/group.jsx'
import {Groups}  from '#/main/core/administration/user/group/components/groups.jsx'
import {actions} from '#/main/core/administration/user/group/actions'

const UserTabComponent = props =>
  <FormSection
    id="group-organizations"
    className="embedded-list-section"
    icon="fa fa-fw fa-building"
    title={t('organizations')}
    disabled={props.new}
    actions={[
      {
        icon: 'fa fa-fw fa-plus',
        label: t('add_organizations'),
        action: () => props.pickOrganizations(props.user.id)
      }
    ]}
  >
    <DataListContainer
      name="users.current.organizations"
      open={OrganizationList.open}
      fetch={{
        url: ['apiv2_user_list_organizations', {id: props.user.id}],
        autoload: props.user.id && !props.new
      }}
      delete={{
        url: ['apiv2_user_remove_organizations', {id: props.user.id}]
      }}
      definition={OrganizationList.definition}
      card={OrganizationList.card}
    />
  </FormSection>


UserTabComponent.propTypes = {
  openForm: T.func.isRequired
}

const UserTab = connect(
  null,
  dispatch => ({
    openForm(id = null) {
      dispatch(actions.open('groups.current', id))
    }
  })
)(UserTabComponent)

export {
  UserTab
}
