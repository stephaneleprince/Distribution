import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {Routes} from '#/main/core/router'

import {select} from '#/plugin/path/resources/path/selectors'

import {Path as PathTypes, Step as StepTypes} from '#/plugin/path/resources/path/prop-types'
import {PathCurrent} from '#/plugin/path/resources/path/components/current.jsx'
import {Step} from '#/plugin/path/resources/path/player/components/step.jsx'
import {Summary} from '#/plugin/path/resources/path/player/components/summary.jsx'
import {getNumbering, flattenSteps} from '#/plugin/path/resources/path/utils'
import {actions} from '#/plugin/path/resources/path/player/actions'

// todo manage empty steps
const PlayerComponent = props =>
  <section>
    <h2 className="sr-only">{trans('play')}</h2>

    {props.path.display.showSummary &&
      <Summary
        steps={props.path.steps}
      />
    }

    <Routes
      redirect={[
        {from: '/play', to: `/play/${props.steps[0].id}`}
      ]}
      routes={[
        {
          path: '/play/:id',
          onEnter: (params) => props.updateProgression(params.id),
          render: (routeProps) => {
            const step = props.steps.find(step => routeProps.match.params.id === step.id)

            return (
              <PathCurrent
                prefix="/play"
                current={step}
                all={props.steps}
              >
                <Step
                  {...step}
                  numbering={getNumbering(props.path.display.numbering, props.path.steps, step)}
                />
              </PathCurrent>
            )
          }
        }
      ]}
    />
  </section>

PlayerComponent.propTypes = {
  path: T.shape(
    PathTypes.propTypes
  ).isRequired,
  steps: T.arrayOf(T.shape(
    StepTypes.propTypes
  )),
  updateProgression: T.func.isRequired
}

const Player = connect(
  state => ({
    path: select.path(state),
    steps: flattenSteps(select.steps(state))
  }),
  dispatch => ({
    updateProgression(stepId) { // todo disable for anonymous
      dispatch(actions.updateProgression(stepId))
    }
  })
)(PlayerComponent)

export {
  Player
}
