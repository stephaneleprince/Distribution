import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/core/translation'
import {NavLink} from '#/main/core/router'

import {PathSummary} from '#/plugin/path/resources/path/components/summary.jsx'

const SummarySteps = props =>
  <ul>
    {props.steps.map(step =>
      <li key={step.id}>
        <NavLink to={`/play/${step.id}`}>
          {step.title}
        </NavLink>

        {step.children && 0 !== step.children.length &&
          <SummarySteps
            steps={step.children}
          />
        }
      </li>
    )}
  </ul>

SummarySteps.propTypes = {
  steps: T.arrayOf(T.shape({

  })).isRequired
}

const Summary = props =>
  <PathSummary>
    <SummarySteps
      steps={props.steps}
    />
  </PathSummary>

Summary.propTypes = {
  opened: T.bool,
  pinned: T.bool,
  steps: T.arrayOf(T.shape({
    // step
  }))
}

Summary.defaultProps = {
  steps: []
}

export {
  Summary
}
