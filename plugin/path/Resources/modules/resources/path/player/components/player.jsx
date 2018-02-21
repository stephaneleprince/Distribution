import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {Routes} from '#/main/core/router'

import {select} from '#/plugin/path/resources/path/selectors'
import {Step} from '#/plugin/path/resources/path/player/components/step.jsx'
import {Summary} from '#/plugin/path/resources/path/player/components/summary.jsx'

const PlayerComponent = props =>
  <section>
    <h2 className="h2 h-first sr-only">Play</h2>

    <Summary
      opened={true}
      pinned={true}
      steps={props.steps}
      toggleOpen={() => true}
      togglePin={() => true}
    />

    <div className="content-container">
      <Routes
        routes={props.steps.map(step => ({
          path: `/play/${step.id}`,
          component: () => <Step {...step} />
        }))}
      />
    </div>
  </section>

PlayerComponent.propTypes = {
  steps: T.arrayOf(T.shape({

  }))
}

const Player = connect(
  state => ({
    steps: select.steps(state)
  })
)(PlayerComponent)

export {
  Player
}
