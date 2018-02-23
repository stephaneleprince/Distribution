import cloneDeep from 'lodash/cloneDeep'

import {trans} from '#/main/core/translation'
import {makeId} from '#/main/core/scaffolding/id'
import {makeReducer} from '#/main/core/scaffolding/reducer'
import {makeFormReducer} from '#/main/core/data/form/reducer'
import {makeListReducer} from '#/main/core/data/list/reducer'

import {getStepPath} from '#/plugin/path/resources/path/editor/utils'

import {
  STEP_ADD,
  STEP_REMOVE,
  STEP_UPDATE_PRIMARY_RESOURCE
} from '#/plugin/path/resources/path/editor/actions'

const defaultState = {
  data: []
}

const reducer = {
  pathForm: makeFormReducer('pathForm', defaultState, {
    pendingChanges: makeReducer(false, {
      [STEP_ADD]: () => true,
      [STEP_REMOVE]: () => true,
      [STEP_UPDATE_PRIMARY_RESOURCE]: () => true
    }),
    data: makeReducer(defaultState.data, {
      [STEP_ADD]: (state, action) => {
        const newState = cloneDeep(state)

        if (!action.parentId) {
          newState.steps.push({
            id: makeId(),
            title: `${trans('step', {}, 'path')} ${newState.steps.length + 1}`,
            description: null,
            children: []
          })
        } else {
          const stepPath = getStepPath(action.parentId, newState.steps, 0, [])
          let step = newState.steps[stepPath[0]]
          let name = `${trans('step', {}, 'path')} ${stepPath[0] + 1}`

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

        return newState
      },
      [STEP_REMOVE]: (state, action) => {
        const newState = cloneDeep(state)
        const stepPath = getStepPath(action.id, newState.steps, 0, [])

        if (stepPath.length === 1) {
          newState.steps.splice(stepPath[0], 1)
        } else {
          let step = newState.steps[stepPath[0]]

          for (let i = 1; i < stepPath.length - 1; ++i) {
            step = step.children[stepPath[i]]
          }
          step.children.splice(stepPath[stepPath.length - 1], 1)
        }

        return newState
      },
      [STEP_UPDATE_PRIMARY_RESOURCE]: (state, action) => {
        const newState = cloneDeep(state)
        const stepPath = getStepPath(action.stepId, newState.steps, 0, [])

        let step = newState.steps[stepPath[0]]

        for (let i = 1; i < stepPath.length; ++i) {
          step = step.children[stepPath[i]]
        }
        step.resource = action.resource

        return newState
      }
    })
  }),
  resourcesPicker: makeListReducer('resourcesPicker')
}

export {
  reducer
}
