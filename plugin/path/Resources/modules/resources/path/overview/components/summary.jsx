import React from 'react'
import {PropTypes as T} from 'prop-types'

import {Step as StepTypes} from '#/plugin/path/resources/path/prop-types'

const Summary = props =>
  <ul className="summary">
    {props.steps.map(step =>
      <li key={step.id}>
        <a href={`#/play/${step.id}`} role="link">
          {step.title}
        </a>

        {step.children && 0 !== step.children.length &&
          <Summary
            steps={step.children}
          />
        }
      </li>
    )}
  </ul>

Summary.propTypes = {
  steps: T.arrayOf(T.shape(
    StepTypes.propTypes
  )).isRequired
}

export {
  Summary
}
