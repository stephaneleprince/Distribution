import cloneDeep from 'lodash/cloneDeep'

import {makeId} from '#/main/core/scaffolding/id'
import {makeReducer} from '#/main/core/scaffolding/reducer'
import {makeFormReducer} from '#/main/core/data/form/reducer'

import {getStepPath} from '#/plugin/path/resources/path/editor/utils'

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
      } else {
        const stepPath = getStepPath(action.parentId, steps, 0, [])
        let step = steps[stepPath[0]]
        let name = `Step ${stepPath[0] + 1}`

        for (let i = 1; i < stepPath.length; ++i) {
          step = step.children[stepPath[i]]
          name += `.${stepPath[i] + 1}`
        }
        step.children.push({
          id: makeId(),
          title: `${name}.${step.children.length + 1}`,
          description: null,
          children: []
        })
      }

      return Object.assign({}, state, {steps: steps})
    },
    [STEP_REMOVE]: (state, action) => {
      const steps = cloneDeep(state.steps)
      const stepPath = getStepPath(action.id, steps, 0, [])

      if (stepPath.length === 1) {
        steps.splice(stepPath[0], 1)
      } else {
        let step = steps[stepPath[0]]

        for (let i = 1; i < stepPath.length - 1; ++i) {
          step = step.children[stepPath[i]]
        }
        step.children.splice(stepPath[stepPath.length - 1], 1)
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
