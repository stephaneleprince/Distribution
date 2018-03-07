import {makeActionCreator} from '#/main/core/scaffolding/actions'

export const WIDGET_ADD    = 'WIDGET_ADD'
export const WIDGET_REMOVE = 'WIDGET_REMOVE'

export const actions = {}

actions.addWidget = makeActionCreator(WIDGET_ADD, 'widgetType', 'position')
actions.removeWidget = makeActionCreator(WIDGET_REMOVE, 'widgetId')
