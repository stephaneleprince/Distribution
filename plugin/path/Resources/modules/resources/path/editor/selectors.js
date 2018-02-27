import {createSelector} from 'reselect'

const path = state => state.pathForm.data

const steps= createSelector(
  [path],
  (path) => path.steps || []
)

export const select = {
  path,
  steps
}
