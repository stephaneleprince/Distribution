import {constants} from '#/plugin/path/resources/path/constants'

/**
 * Flattens a tree of steps into a one-level array.
 *
 * @param {Array} steps
 */
function flattenSteps(steps) {
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

// todo finish implementation

/**
 * Get the display numbering of a step.
 *
 * @param {string} type
 * @param {Array} steps
 * @param {Step.propTypes} step
 *
 * @return {string}
 */
function getNumbering(type, steps, step) {
  switch (type) {
    /**
     * The numbering label is a letter.
     */
    case constants.NUMBERING_NUMERIC:
      return 1 + ''

    /**
     * The numbering label is a number.
     */
    case constants.NUMBERING_LITERAL:
      return 'abcdefghijklmnopqrstuvwxyz'[0]

    /**
     * The numbering label is specified by each step.
     */
    case constants.NUMBERING_CUSTOM:
      return step.display.numbering

    /**
     * The numbering feature is disabled.
     */
    case constants.NUMBERING_NONE:
    default:
      return ''
  }
}

export {
  flattenSteps,
  getNumbering
}
