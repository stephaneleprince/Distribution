import {makeActionCreator} from '#/main/core/scaffolding/actions'

export const STEP_ADD = 'STEP_ADD'
export const STEP_REMOVE = 'STEP_REMOVE'
export const STEP_UPDATE_PRIMARY_RESOURCE = 'STEP_UPDATE_PRIMARY_RESOURCE'

export const STEP_ADD_SECONDARY_RESOURCES = 'STEP_ADD_SECONDARY_RESOURCES'
export const STEP_REMOVE_SECONDARY_RESOURCES = 'STEP_REMOVE_SECONDARY_RESOURCES'

export const actions = {}

actions.addStep = makeActionCreator(STEP_ADD, 'parentId')
actions.removeStep = makeActionCreator(STEP_REMOVE, 'id')
actions.updatePrimaryResource = makeActionCreator(STEP_UPDATE_PRIMARY_RESOURCE, 'stepId', 'resource')

actions.addSecondaryResources = makeActionCreator(STEP_ADD_SECONDARY_RESOURCES, 'stepId', 'resources')
actions.removeSecondaryResources = makeActionCreator(STEP_REMOVE_SECONDARY_RESOURCES, 'stepId', 'resources')
