import cloneDeep from 'lodash/cloneDeep'

import {makeId} from '#/main/core/scaffolding/id'
import {makeReducer} from '#/main/core/scaffolding/reducer'
import {makeFormReducer} from '#/main/core/data/form/reducer'

import {
  STEP_OPEN,
  STEP_ADD,
  STEP_REMOVE
} from '#/plugin/path/resources/path/editor/actions'

const defaultState = {
  currentStep: null,
  data: []
}

const reducer = makeFormReducer('pathForm', defaultState, {
  pendingChanges: makeReducer(false, {
    [STEP_ADD]: () => true,
    [STEP_REMOVE]: () => true
  }),
  data: makeReducer(defaultState.data, {
    [STEP_ADD]: (state, action) => {
      const steps = cloneDeep(state.steps)


      return Object.assign({}, state, {steps: steps})
    }
  }),
  currentStep: makeReducer(defaultState.currentStep, {
    [STEP_OPEN]: (state, action) => action.id
  })
})

export {
  reducer
}
