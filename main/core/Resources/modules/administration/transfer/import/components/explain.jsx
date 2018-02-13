import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import classes from 'classnames'
import has from 'lodash/has'

import {trans} from '#/main/core/translation'
import {TooltipElement} from '#/main/core/layout/components/tooltip-element.jsx'

import {select} from '#/main/core/administration/transfer/selectors'

const Property = props =>
  <li className="schema-def schema-property list-group-item">
    <strong className="property-name">
      {props.name}

      <small>
        [{typeof props.type === 'string' ?
          trans(props.type)
          :
          props.type.map(type => trans(type)).join('|')
        }]
      </small>
    </strong>

    <span className={classes('label', {
      'label-primary': props.required,
      'label-default': !props.required
    })}>
      {trans(props.required ? 'required':'optional')}
    </span>

    {props.description &&
      <p className="property-desc">{props.description}</p>
    }
  </li>

Property.propTypes = {
  name: T.string.isRequired,
  type: T.oneOfType([T.string, T.array]).isRequired,
  description: T.string,
  required: T.bool,
  isArray: T.bool
}

const OneOf = props =>
  <li className="schema-def schema-oneOf list-group-item">
    <TooltipElement
      id=""
      position="right"
      tip={trans('one_of_field_list')}
    >
      <span className="schema-or">{trans('or')}</span>
    </TooltipElement>

    <ul className="list-group">
      {props.oneOf.map((oneOf, index) =>
        oneOf.properties.map((prop, index) =>
          <Field key={index} {...prop} />
        )
      )}
    </ul>
  </li>

OneOf.propTypes = {
  oneOf: T.arrayOf(T.shape({
    properties: T.arrayOf(T.shape(
      Property.propTypes
    ))
  }))
}

const Field = props => has(props, 'oneOf') ?
  <OneOf {...props} />
  :
  <Property {...props} />

const FlatSchema = props => {
  const entity = props.match.params.entity
  const action = props.match.params.action

  const explain = props.explanation[entity][action]

  return explain &&
    <div>
      <ul className="nav nav-tabs">
        <li role="presentation" className="active">
          <a href="#">Explications</a>
        </li>
        <li role="presentation"><a href="#">Exemples</a></li>
        <li role="presentation"><a href="#">Aperçu</a></li>
      </ul>

      <div className="schema-explain panel panel-default">
        <div className="panel-body">
          {trans('import_headers')}
        </div>

        {0 !== explain.properties.length &&
          <ul className="schema-explain-flat list-group list-group-stripped list-group-hover">
            {explain.properties.map((prop, index) =>
              <Field key={index} {...prop} />
            )}
          </ul>
        }
      </div>
    </div>
}

const FlatSchemaExplain = connect(
  state => ({
    explanation: select.explanation(state)
  })
)(FlatSchema)

const JsonSchemaExplain = props =>
  <div></div>

class Schema extends Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  render() {
    return (
      <div>
        <ul className="nav nav-tabs">
          <li role="presentation" className="active">
            <a href="#">Explications</a>
          </li>
          <li role="presentation"><a href="#">Exemples</a></li>
        </ul>

        <div className="schema-explain panel panel-default">

        </div>
      </div>
    )
  }
}

export {
  FlatSchemaExplain,
  JsonSchemaExplain
}
