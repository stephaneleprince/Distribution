import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/core/translation'
import {FormContainer} from '#/main/core/data/form/containers/form.jsx'

export const ParametersForm = props =>
  <FormContainer
    level={3}
    name="pathForm"
    sections={[{
      id: 'parameters',
      title: trans('parameters', {}, 'platform'),
      fields: [
        {
          name: 'display.showOverview',
          type: 'boolean',
          label: trans('show_overview', {}, 'path'),
          linked: [
            {
              name: 'display.description',
              type: 'html',
              label: trans('description', {}, 'platform'),
              displayed: props.path.display.showOverview,
              required: false
            }
          ]
        },
        {
          name: 'display.showSummary',
          type: 'boolean',
          label: trans('show_summary', {}, 'path')
        }
      ]
    }]}
  />

ParametersForm.propTypes = {
  path: T.shape({
    display: T.shape({
      description: T.string,
      showOverview: T.bool.isRequired,
      showSummary: T.bool.isRequired
    })
  }).isRequired
}
