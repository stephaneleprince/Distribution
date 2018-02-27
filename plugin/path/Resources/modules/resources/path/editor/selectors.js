import {createSelector} from 'reselect'

const resourceTypes = state => state.resourceTypes
const path = state => state.pathForm.data


const steps= createSelector(
  [path],
  (path) => path.steps || []
)

export const select = {
  resourceTypes,
  path,
  steps
}
