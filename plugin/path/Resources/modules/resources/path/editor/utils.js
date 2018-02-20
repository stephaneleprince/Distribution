function getFormDataPart(id, steps) {
  const stepPath = getStepPath(id, steps, 0, [])
  let formDataPart = `steps[${stepPath[0]}]`

  for (let i = 1; i < stepPath.length; ++i) {
    formDataPart += `.children[${stepPath[i]}]`
  }

  return formDataPart
}

function getStepPath(id, steps, level, indexes) {
  const index = steps.findIndex(s => s.id === id)

  if (index > -1) {
    indexes[level] = index

    return indexes
  } else {
    for (let key = 0; key < steps.length; ++key) {
      if (steps[key].children.length > 0) {
        indexes[level] = key
        const stepPath = getStepPath(id, steps[key].children, level + 1, indexes)

        if (stepPath) {
          return stepPath
        }
      }
    }

    return null
  }
}

export {
  getFormDataPart,
  getStepPath
}
