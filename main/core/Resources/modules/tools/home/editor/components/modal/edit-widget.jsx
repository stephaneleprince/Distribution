import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/core/translation'
import {DataFormModal} from '#/main/core/data/form/modals/components/data-form'

const MODAL_EDIT_WIDGET = 'MODAL_EDIT_WIDGET'

const EditWidgetModal = props =>
  <DataFormModal
    {...props}
    title={trans('edit_widget', {}, 'home')}
    sections={[
      {
        id: 'general',
        title: trans('general'),
        primary: true,
        fields: [
          {
            name: 'name',
            type: 'string',
            label: trans('name')
          }
        ]
      }, {
        id: 'display',
        icon: 'fa fa-fw fa-desktop',
        title: trans('display_parameters'),
        fields: [
          {
            name: 'display.color',
            label: trans('color'),
            type: 'color'
          }, {
            name: 'display.background',
            label: trans('background'),
            type: 'enum',
            options: {
              noEmpty: true,
              choices: {
                none: trans('none'),
                color: trans('color'),
                image: trans('image')
              }
            },
            linked: [
              {
                name: 'display.backgroundImage',
                label: trans('image'),
                type: 'image',
                required: true,
                displayed: (widget) => widget.display && 'image' === widget.display.background,
              }, {
                name: 'display.backgroundColor',
                label: trans('color'),
                type: 'color',
                required: true,
                displayed: (widget) => widget.display && 'color' === widget.display.background
              }
            ]
          }
        ]
      }
    ]}
  />

EditWidgetModal.propTypes = {
  save: T.func.isRequired
}

export {
  MODAL_EDIT_WIDGET,
  EditWidgetModal
}
