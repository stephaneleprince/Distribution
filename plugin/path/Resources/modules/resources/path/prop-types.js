import {PropTypes as T} from 'prop-types'

const Step = {
  propTypes: {
    id: T.string.isRequired,
    title: T.string,
    description: T.string,
    poster: T.shape({
      url: T.string
    }),
    display: T.shape({
      numbering: T.string
    }).isRequired,
    primaryResource: T.shape({
      autoId: T.number.isRequired,
      meta: T.shape({
        type: T.string.isRequired
      })
    })
  },
  defaultProps: {
    children: []
  }
}

const Path = {
  propTypes: {
    id: T.string.isRequired,
    display: T.shape({
      showOverview: T.bool,
      showSummary: T.bool,
      openSummary: T.bool,
      numbering: T.oneOf(['none', 'numeric', 'literal', 'custom'])
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