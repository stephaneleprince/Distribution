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
  STEP_UPDATE_PRIMARY_RESOURCE,
  STEP_ADD_SECONDARY_RESOURCES,
  STEP_REMOVE_SECONDARY_RESOURCES,
  STEP_UPDATE_SECONDARY_RESOURCE_INHERITANCE,
  STEP_REMOVE_INHERITED_RESOURCES
} from '#/plugin/path/resources/path/editor/actions'

function manageInheritedResources(step, id, resource, lvl) {
  const index = step.inheritedResources.findIndex(ir => ir.sourceUuid === id)

  if (index === -1 && resource) {
    step.inheritedResources.push({
      id: makeId(),
      resource: resource,
      lvl: lvl,
      sourceUuid: id
    })
  } else if (index > -1 && !resource) {
    step.inheritedResources.splice(index, 1)
  }
  step.children.forEach(s => manageInheritedResources(s, id, resource, lvl))

  console.log(step)
}

const defaultState = {
  data: []
}

const reducer = {
  pathForm: makeFormReducer('pathForm', defaultState, {
    pendingChanges: makeReducer(false, {
      [STEP_ADD]: () => true,
      [STEP_REMOVE]: () => true,
      [STEP_UPDATE_PRIMARY_RESOURCE]: () => true,
      [STEP_ADD_SECONDARY_RESOURCES]: () => true,
      [STEP_REMOVE_SECONDARY_RESOURCES]: () => true,
      [STEP_UPDATE_SECONDARY_RESOURCE_INHERITANCE]: () => true,
      [STEP_REMOVE_INHERITED_RESOURCES]: () => true
    }),
    data: makeReducer(defaultState.data, {
      [STEP_ADD]: (state, action) => {
        const newState = cloneDeep(state)

        if (!action.parentId) {
          newState.steps.push({
            id: makeId(),
            title: `${trans('step', {}, 'path')} ${newState.steps.length + 1}`,
            description: null,
            display: {},
            secondaryResources: [],
            inheritedResources: [],
            children: [],
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
            display: {},
            secondaryResources: [],
            inheritedResources: [],
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
        step.primaryResource = action.resource

        return newState
      },
      [STEP_ADD_SECONDARY_RESOURCES]: (state, action) => {
        const newState = cloneDeep(state)
        const stepPath = getStepPath(action.stepId, newState.steps, 0, [])

        let step = newState.steps[stepPath[0]]

        for (let i = 1; i < stepPath.length; ++i) {
          step = step.children[stepPath[i]]
        }
        action.resources.forEach(r => step.secondaryResources.push({
          id: makeId(),
          inheritanceEnabled: false,
          resource: r
        }))

        return newState
      },
      [STEP_REMOVE_SECONDARY_RESOURCES]: (state, action) => {
        const newState = cloneDeep(state)
        const stepPath = getStepPath(action.stepId, newState.steps, 0, [])

        let step = newState.steps[stepPath[0]]

        for (let i = 1; i < stepPath.length; ++i) {
          step = step.children[stepPath[i]]
        }
        action.resources.forEach(r => {
          const index = step.secondaryResources.findIndex(sr => sr.id === r)

          if (index > -1) {
            step.secondaryResources.splice(index, 1)
          }
        })

        return newState
      },
      [STEP_UPDATE_SECONDARY_RESOURCE_INHERITANCE]: (state, action) => {
        const newState = cloneDeep(state)
        const stepPath = getStepPath(action.stepId, newState.steps, 0, [])

        let step = newState.steps[stepPath[0]]

        for (let i = 1; i < stepPath.length; ++i) {
          step = step.children[stepPath[i]]
        }
        const lvl = stepPath.length - 1
        const secondaryResource = step.secondaryResources.find(sr => sr.id === action.id)

        if (secondaryResource) {
          secondaryResource.inheritanceEnabled = action.value
          const resource = action.value ? secondaryResource.resource : null
          step.children.forEach(s => manageInheritedResources(s, action.id, resource, lvl))
        }

        return newState
      },
      [STEP_REMOVE_INHERITED_RESOURCES]: (state, action) => {
        const newState = cloneDeep(state)
        const stepPath = getStepPath(action.stepId, newState.steps, 0, [])

        let step = newState.steps[stepPath[0]]

        for (let i = 1; i < stepPath.length; ++i) {
          step = step.children[stepPath[i]]
        }
        action.resources.forEach(r => {
          const index = step.inheritedResources.findIndex(sr => sr.id === r)

          if (index > -1) {
            step.inheritedResources.splice(index, 1)
          }
        })

        return newState
      }
    })
  }),
  resourcesPicker: makeListReducer('resourcesPicker')
}

export {
  reducer
}
