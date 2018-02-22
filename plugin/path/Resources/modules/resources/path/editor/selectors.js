import {createSelector} from 'reselect'

const pathFormData = state => state.pathForm.data

const stepsForm = createSelector(
  [pathFormData],
  (pathFormData) => pathFormData.steps || []
)

const flatStepsForm = createSelector(
  [stepsForm],
  (stepsForm) => {
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

    return stepsForm.reduce((acc, step) => {
      acc = acc.concat(flatten(step))

      return acc
    }, [])
  }
)

export const select = {
  flatStepsForm
}
