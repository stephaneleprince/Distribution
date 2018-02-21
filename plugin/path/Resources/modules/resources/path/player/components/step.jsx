import React from 'react'

import {HtmlText} from '#/main/core/layout/components/html-text.jsx'

import {Step as StepTypes} from '#/plugin/path/resources/path/prop-types'

const Step = props =>
  <section className="current-step">
    <h3 className="h2 h-first step-title">{props.title}</h3>

    {props.description &&
      <div className="panel panel-default">
        <HtmlText className="panel-body">{props.description}</HtmlText>
      </div>
    }
  </section>

Step.propTypes = StepTypes.propTypes

export {
  Step
}