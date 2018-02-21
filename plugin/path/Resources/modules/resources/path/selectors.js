import {createSelector} from 'reselect'

const path = state => state.path

const steps = createSelector(
  [path],
  (path) => path.steps || []
)

const empty = createSelector(
  [steps],
  (steps) => 0 === steps.length
)

export const select = {
  path,
  steps,
  empty
}
