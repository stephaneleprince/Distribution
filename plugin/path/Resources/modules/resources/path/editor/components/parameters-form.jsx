import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/core/translation'
import {FormContainer} from '#/main/core/data/form/containers/form.jsx'

const ParametersForm = props =>
  <FormContainer
    level={3}
    displayLevel={2}
    name="pathForm"
    title={trans('parameters')}
    className="content-container"
    sections={[{
      id: 'parameters',
      title: trans('parameters'),
      fields: [
        {
          name: 'display.showOverview',
          type: 'boolean',
          label: trans('show_overview', {}, 'path'),
          linked: [
            {
              name: 'display.description',
              type: 'html',
              label: trans('overview_message', {}, 'path'),
              displayed: props.path.display.showOverview
            }
          ]
        }, {
          name: 'display.showSummary',
          type: 'boolean',
          label: trans('show_summary', {}, 'path'),
          linked: [
            {
              name: 'display.openSummary',
              type: 'boolean',
              label: trans('show_opened_summary', {}, 'path'),
              displayed: props.path.display.showSummary
            }
          ]
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

export {
  ParametersForm
}
