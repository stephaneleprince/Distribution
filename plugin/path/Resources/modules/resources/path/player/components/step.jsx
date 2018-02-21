import React from 'react'
import {PropTypes as T} from 'prop-types'

import {Step as StepTypes} from '#/plugin/path/resources/path/prop-types'

const Step = props =>
  <section className="">
    <h2 className="">{props.title}</h2>
  </section>

Step.propTypes = StepTypes.propTypes

export {
  Step
}