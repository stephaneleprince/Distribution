import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {Routes} from '#/main/core/router'

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
      steps={props.steps}
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
  steps: T.arrayOf(T.shape(
    StepTypes.propTypes
  ))
}

const Player = connect(
  state => ({
    steps: select.flatSteps(state)
  })
)(PlayerComponent)

export {
  Player
}
