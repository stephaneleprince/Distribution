import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/core/translation'
import {ResourceOverview} from '#/main/core/resource/components/overview.jsx'

import {select} from '#/plugin/path/resources/path/selectors'

const OverviewComponent = props =>
  <ResourceOverview
    contentText={props.path.display.description ||
      <span className="empty-text">{trans('no_description', {}, 'platform')}</span>
    }
    actions={[]}
  >
    <section className="resource-parameters">
    </section>
  </ResourceOverview>

OverviewComponent.propTypes = {
  path: T.object.isRequired
}

const Overview = connect(
  (state) => ({
    path: select.path(state)
  }),
  (dispatch) => ({})
)(OverviewComponent)

export {
  Overview
}
