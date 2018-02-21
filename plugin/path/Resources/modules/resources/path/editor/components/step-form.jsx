import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/core/translation'
import {FormContainer} from '#/main/core/data/form/containers/form.jsx'

import {getFormDataPart} from '#/plugin/path/resources/path/editor/utils'

export const StepForm = props =>
  <FormContainer
    level={3}
    name="pathForm"
    dataPart={getFormDataPart(props.stepId, props.path.steps)}
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

StepForm.propTypes = {
  path: T.shape({
    steps: T.array
  }).isRequired,
  stepId: T.string.isRequired
}