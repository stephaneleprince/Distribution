import React, {Component} from 'react'

import {asset} from '#/main/core/scaffolding/asset'
import {url} from '#/main/core/api/router'
import {PropTypes as T, implementPropTypes} from '#/main/core/scaffolding/prop-types'
import {HtmlText} from '#/main/core/layout/components/html-text.jsx'

import {Step as StepTypes} from '#/plugin/path/resources/path/prop-types'

class PrimaryResource extends Component {
  constructor(props) {
    super(props)

    this.resize = this.resize.bind(this)
  }

  /**
   * Resize the iFrame DOM is modified.
   *
   * @param {object} e - The JS Event Object
   */
  resize(e) {
    if (typeof e.data === 'string' && e.data.indexOf('documentHeight:') > -1) {
      // Split string from identifier
      const height = e.data.split('documentHeight:')[1]

      this.iframe.height = parseInt(height)
    }
  }

  componentDidMount() {
    window.addEventListener('message', this.resize)
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.resize)
  }

  render() {
    return (
      <iframe
        id="embeddedActivity"
        ref={el => this.iframe = el}
        height={0}
        src={url(['claro_resource_open', {node: this.props.id, resourceType: this.props.type}], {iframe: 1})}
        allowFullScreen={true}
      />
    )
  }
}

PrimaryResource.propTypes = {
  id: T.number.isRequired,
  type: T.string.isRequired
}

/**
 * Renders step content.
 */
const Step = props =>
  <div className="current-step">
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

    {props.primaryResource &&
      <PrimaryResource
        id={props.primaryResource.autoId}
        type={props.primaryResource.meta.type}
      />
    }
  </div>

implementPropTypes(Step, StepTypes, {
  numbering: T.string
})

export {
  Step
}
