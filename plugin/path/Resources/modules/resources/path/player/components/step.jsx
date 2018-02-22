import React from 'react'

import {implementPropTypes} from '#/main/core/scaffolding/prop-types'
import {HtmlText} from '#/main/core/layout/components/html-text.jsx'

import {Step as StepTypes} from '#/plugin/path/resources/path/prop-types'

/**
 * Renders step content.
 */
const Step = props =>
  <section className="current-step">
    <img className="step-poster img-responsive" src="/img/paper.jpg" />

    <h3 className="h2">{props.title}</h3>

    {props.description &&
      <div className="panel panel-default">
        <HtmlText className="panel-body">{props.description}</HtmlText>
      </div>
    }
  </section>

implementPropTypes(Step, StepTypes)

export {
  Step
}
