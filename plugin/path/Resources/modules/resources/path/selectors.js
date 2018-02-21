import {createSelector} from 'reselect'

// path
const path = state => state.path

const steps = createSelector(
  [path],
  (path) => path.steps || []
)

const flatSteps = createSelector(
  [steps],
  (steps) => {
    function flatten(step) {
      const children = step.children
      const flatStep = Object.assign({}, step)
      delete flatStep.children

      let flattened = [flatStep]

      if (children) {
        children.map(child => {
          flattened = flattened.concat(flatten(child))
        })
      }

      return flattened
    }

    return steps.reduce((acc, step) => {
      acc = acc.concat(flatten(step))

      return acc
    }, [])
  }
)

const empty = createSelector(
  [steps],
  (steps) => 0 === steps.length
)

// summary
const summary = state => state.summary

const summaryPinned = createSelector(
  [summary],
  (summary) => summary.pinned
)

const summaryOpened = createSelector(
  [summary],
  (summary) => summary.opened
)


export const select = {
  path,
  steps,
  flatSteps,
  empty,
  summaryPinned,
  summaryOpened
}
