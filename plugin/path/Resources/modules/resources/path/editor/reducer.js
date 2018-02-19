import cloneDeep from 'lodash/cloneDeep'

import {makeId} from '#/main/core/scaffolding/id'
import {makeReducer} from '#/main/core/scaffolding/reducer'
import {makeFormReducer} from '#/main/core/data/form/reducer'

import {
  SECTION_OPEN,
  STEP_ADD,
  STEP_REMOVE
} from '#/plugin/path/resources/path/editor/actions'

const defaultState = {
  currentSection: 'parameters',
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

      if (!action.parentId) {
        steps.push({
          id: makeId(),
          title: `Step ${steps.length + 1}`,
          description: null,
          children: []
        })
      }

      return Object.assign({}, state, {steps: steps})
    }
  }),
  currentSection: makeReducer(defaultState.currentSection, {
    [SECTION_OPEN]: (state, action) => action.id
  })
})

export {
  reducer
}
