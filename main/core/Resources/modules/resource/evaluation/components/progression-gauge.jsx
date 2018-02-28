import React from 'react'
import {PropTypes as T} from 'prop-types'

import {LiquidGauge} from '#/main/core/layout/evaluation/components/liquid-gauge.jsx'

import {UserEvaluation as UserEvaluationTypes} from '#/main/core/resource/evaluation/prop-types'

/**
 * Renders a gauge to display progression of the user in the resource evaluation.
 */
const ProgressionGauge = props =>
  <LiquidGauge
    id={`user-progression`}
    type="user"
  />

ProgressionGauge.propTypes = {
  userEvaluation: T.shape(
    UserEvaluationTypes.propTypes
  ).isRequired
}

export {
  ProgressionGauge
}
