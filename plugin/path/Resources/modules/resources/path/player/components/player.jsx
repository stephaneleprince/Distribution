import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {Routes} from '#/main/core/router'
import {ProgressBar} from '#/main/core/layout/components/progress-bar.jsx'

import {actions} from '#/plugin/path/resources/path/actions'
import {select} from '#/plugin/path/resources/path/selectors'

import {Step as StepTypes} from '#/plugin/path/resources/path/prop-types'
import {Step} from '#/plugin/path/resources/path/player/components/step.jsx'
import {Summary} from '#/plugin/path/resources/path/player/components/summary.jsx'

const PlayerComponent = props =>
  <section>
    <h2 className="sr-only">Play</h2>

    <Summary
      opened={props.summaryOpened}
      pinned={props.summaryPinned}
      steps={props.steps}
      toggleOpen={props.toggleOpen}
      togglePin={props.togglePin}
    />

    <div className="content-container">
      <ProgressBar
        value={25}
        size="xs"
        type="user"
      />

      <Routes
        routes={props.steps.map(step => ({
          path: `/play/${step.id}`,
          render: () => <Step {...step} />
        }))}
      />

      <nav className="path-navigation">
        <button className="btn btn-lg btn-link">
          <span className="fa fa-angle-double-left icon-with-text-right" />
          {trans('previous')}
        </button>
        <button className="btn btn-lg btn-link">
          {trans('next')}
          <span className="fa fa-angle-double-right icon-with-text-left" />
        </button>
      </nav>
    </div>
  </section>

PlayerComponent.propTypes = {
  summaryPinned: T.bool.isRequired,
  summaryOpened: T.bool.isRequired,
  toggleOpen: T.func.isRequired,
  togglePin: T.func.isRequired,
  steps: T.arrayOf(T.shape(
    StepTypes.propTypes
  ))
}

const Player = connect(
  state => ({
    steps: select.flatSteps(state),
    summaryPinned: select.summaryPinned(state),
    summaryOpened: select.summaryOpened(state)
  }),
  dispatch => ({
    toggleOpen() {
      dispatch(actions.toggleSummaryOpen())
    },
    togglePin() {
      dispatch(actions.toggleSummaryPin())
    }
  })
)(PlayerComponent)

export {
  Player
}
