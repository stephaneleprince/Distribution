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

const PendingTabComponent = props =>
  <div>
    Pending
  </div>

PendingTabComponent.propTypes = {
}

const PendingTab = connect(
  null,
  null
)(PendingTabComponent)

export {
  PendingTab
}
