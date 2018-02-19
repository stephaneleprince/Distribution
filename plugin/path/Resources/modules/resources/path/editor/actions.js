import {makeActionCreator} from '#/main/core/scaffolding/actions'
// import {API_REQUEST} from '#/main/core/api/actions'

export const SECTION_OPEN = 'SECTION_OPEN'
export const STEP_ADD = 'STEP_ADD'
export const STEP_REMOVE = 'STEP_REMOVE'

export const actions = {}

actions.openSection = makeActionCreator(SECTION_OPEN, 'id')
actions.addStep = makeActionCreator(STEP_ADD, 'parentId')
actions.removeStep = makeActionCreator(STEP_REMOVE, 'id')
