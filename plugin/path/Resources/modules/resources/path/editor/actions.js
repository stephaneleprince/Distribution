import {makeActionCreator} from '#/main/core/scaffolding/actions'
// import {API_REQUEST} from '#/main/core/api/actions'

export const STEP_OPEN = 'STEP_OPEN'
export const STEP_ADD = 'STEP_ADD'
export const STEP_REMOVE = 'STEP_REMOVE'

export const actions = {}

actions.openStep = makeActionCreator(STEP_OPEN, 'id')
actions.addStep = makeActionCreator(STEP_ADD, 'parentId')
actions.removeStep = makeActionCreator(STEP_REMOVE, 'id')
