import {makeActionCreator} from '#/main/core/scaffolding/actions'
// import {API_REQUEST} from '#/main/core/api/actions'

export const STEP_ADD = 'STEP_ADD'
export const STEP_REMOVE = 'STEP_REMOVE'

actions.addStep = makeActionCreator(STEP_ADD)
actions.removeStep = makeActionCreator(STEP_REMOVE, 'id')
