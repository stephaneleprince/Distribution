import {PropTypes as T} from 'prop-types'

const Step = {
  propTypes: {
    id: T.string.isRequired,
    title: T.string,
    description: T.string
  },
  defaultProps: {
    children: []
  }
}

const Path = {
  propTypes: {
    id: T.string.isRequired,
    display: T.shape({

    }).isRequired,
    steps: T.arrayOf(T.shape(
      Step.propTypes
    ))
  },
  defaultProps: {
    steps: []
  }
}

export {
  Step,
  Path
}
