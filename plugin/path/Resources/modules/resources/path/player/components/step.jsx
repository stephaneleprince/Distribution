import React from 'react'

import {asset} from '#/main/core/scaffolding/asset'
import {PropTypes as T, implementPropTypes} from '#/main/core/scaffolding/prop-types'
import {HtmlText} from '#/main/core/layout/components/html-text.jsx'

import {Step as StepTypes} from '#/plugin/path/resources/path/prop-types'

/**
 * Renders step content.
 */
const Step = props =>
  <section className="current-step">
    {props.poster &&
      <img className="step-poster img-responsive" alt={props.title} src={asset(props.poster.url)} />
    }

    <h3 className="h2">
      {props.numbering &&
        <span className="step-number">{props.numbering}</span>
      }

      {props.title}
    </h3>

    {props.description &&
      <div className="panel panel-default">
        <HtmlText className="panel-body">{props.description}</HtmlText>
      </div>
    }
  </section>

implementPropTypes(Step, StepTypes, {
  numbering: T.string
})

export {
  Step
}
