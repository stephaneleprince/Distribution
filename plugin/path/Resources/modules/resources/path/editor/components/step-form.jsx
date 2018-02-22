import React from 'react'

import {trans} from '#/main/core/translation'
import {PropTypes as T, implementPropTypes} from '#/main/core/scaffolding/prop-types'
import {FormContainer} from '#/main/core/data/form/containers/form.jsx'

import {Step as StepTypes} from '#/plugin/path/resources/path/prop-types'

const StepForm = props =>
  <FormContainer
    level={3}
    displayLevel={2}
    name="pathForm"
    title={props.title}
    dataPart={props.stepPath}
    sections={[{
      id: 'step',
      title: 'step',
      fields: [
        {
          name: 'title',
          type: 'string',
          label: trans('title', {}, 'platform'),
          required: true
        },
        {
          name: 'description',
          type: 'html',
          label: trans('description', {}, 'platform'),
          required: false
        }
      ]
    }]}
  />

implementPropTypes(StepForm, StepTypes, {
  stepPath: T.string.isRequired
})

StepForm.propTypes = {
  path: T.shape({
    steps: T.array
  }).isRequired,
  stepId: T.string.isRequired
}

export {
  StepForm
}
