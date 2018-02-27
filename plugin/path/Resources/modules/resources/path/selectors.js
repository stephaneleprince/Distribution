import {createSelector} from 'reselect'

// path
const path = state => state.path

const steps = createSelector(
  [path],
  (path) => path.steps || []
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
  empty,
  summaryPinned,
  summaryOpened
}
