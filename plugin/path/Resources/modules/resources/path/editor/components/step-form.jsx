import React from 'react'

import {trans} from '#/main/core/translation'
import {PropTypes as T, implementPropTypes} from '#/main/core/scaffolding/prop-types'
import {FormContainer} from '#/main/core/data/form/containers/form.jsx'

import {Step as StepTypes} from '#/plugin/path/resources/path/prop-types'

const ResourceSection = props =>
  <div className="panel panel-default">
    <div className="panel-body">
      <label>
        {trans('primary_resource', {}, 'path')}
      </label>
      {!props.resource ?
        <div>
          {trans('no_primary_resource', {}, 'path')}
        </div> :
        <div>
          {props.resource.name} [{trans(props.resource.meta.type, {}, 'resource')}]
          <span
            className="fa fa-fw fa-trash-o pointer-hand"
            onClick={() => props.removePrimaryResource(props.stepId)}
          />
        </div>
      }
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => props.pickPrimaryResource(props.stepId)}
      >
        <span className="fa fa-fw fa-plus icon-with-text-right"/>
        {trans('select_primary_resource', {}, 'path')}
      </button>
    </div>
  </div>

ResourceSection.propTypes = {
  resource: T.shape({
    id: T.string.isRequired,
    name: T.string.isRequired
  }),
  pickPrimaryResource: T.func.isRequired,
  removePrimaryResource: T.func.isRequired
}

const StepForm = props =>
  <FormContainer
    level={3}
    displayLevel={2}
    name="pathForm"
    title={props.title}
    dataPart={props.stepPath}
    sections={[
      {
        id: 'info',
        title: trans('information'),
        icon: 'fa fa-fw fa-info',
        fields: [
          {
            name: 'title',
            type: 'string',
            label: trans('title'),
            required: true
          }, {
            name: 'description',
            type: 'html',
            label: trans('description')
          }
        ]
      }, {
        id: 'display',
        icon: 'fa fa-fw fa-desktop',
        title: trans('display_parameters'),
        fields: [
          {
            name: 'poster',
            type: 'image',
            label: trans('poster'),
            options: {
              ratio: '3:1'
            }
          }, {
            name: 'display.numbering',
            type: 'string',
            label: trans('step_numbering', {}, 'path'),
            displayed: props.customNumbering
          }
        ]
      }
    ]}
  >
    <ResourceSection
      stepId={props.id}
      resource={props.resource}
      pickPrimaryResource={props.pickPrimaryResource}
      removePrimaryResource={props.removePrimaryResource}
    />
  </FormContainer>

implementPropTypes(StepForm, StepTypes, {
  stepPath: T.string.isRequired,
  numbering: T.string,
  customNumbering: T.bool,
  pickPrimaryResource: T.func.isRequired,
  removePrimaryResource: T.func.isRequired
}, {
  customNumbering: false
})

export {
  StepForm
}
