import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {Routes} from '#/main/core/router'

import {actions} from '#/plugin/path/resources/path/actions'
import {select} from '#/plugin/path/resources/path/selectors'

import {Step as StepTypes} from '#/plugin/path/resources/path/prop-types'
import {PathCurrent} from '#/plugin/path/resources/path/components/current.jsx'
import {Step} from '#/plugin/path/resources/path/player/components/step.jsx'
import {Summary} from '#/plugin/path/resources/path/player/components/summary.jsx'

// todo manage empty steps
const PlayerComponent = props =>
  <section>
    <h2 className="sr-only">{trans('play')}</h2>

    <Summary
      opened={props.summaryOpened}
      pinned={props.summaryPinned}
      steps={props.steps}
      toggleOpen={props.toggleOpen}
      togglePin={props.togglePin}
    />

    <Routes
      redirect={[
        {from: '/play', to: `/play/${props.steps[0].id}`}
      ]}
      routes={[
        {
          path: `/play/:id`,
          render: (routeProps) => {
            const step = props.steps.find(step => routeProps.match.params.id === step.id)

            return (
              <PathCurrent
                prefix="/play"
                current={step}
                all={props.steps}
              >
                <Step {...step} />
              </PathCurrent>
            )
          }
        }
      ]}
    />
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
