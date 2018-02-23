import {makeActionCreator} from '#/main/core/scaffolding/actions'

export const STEP_ADD = 'STEP_ADD'
export const STEP_REMOVE = 'STEP_REMOVE'
export const STEP_UPDATE_PRIMARY_RESOURCE = 'STEP_UPDATE_PRIMARY_RESOURCE'

export const actions = {}

actions.addStep = makeActionCreator(STEP_ADD, 'parentId')
actions.removeStep = makeActionCreator(STEP_REMOVE, 'id')
actions.updatePrimaryResource = makeActionCreator(STEP_UPDATE_PRIMARY_RESOURCE, 'stepId', 'resource')
