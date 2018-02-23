import React from 'react'
import {PropTypes as T} from 'prop-types'

import {Step as StepTypes} from '#/plugin/path/resources/path/prop-types'

const SummaryStep = props =>
  <li>
    <a className="summary-link" href={`#/play/${props.id}`} role="link">
      {props.title}
    </a>

    {0 !== props.children.length &&
      <ul>
        {props.children.map(child =>
          <SummaryStep key={child.id} {...child} />
        )}
      </ul>
    }
  </li>

SummaryStep.propTypes = {

}

const Summary = props =>
  <ul className="summary-overview">
    {props.steps.map(step =>
      <SummaryStep key={step.id} {...step} />
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
