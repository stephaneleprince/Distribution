import {PropTypes as T} from 'prop-types'

const ResourceNode = {
  propTypes: {
    name: T.string.isRequired,
    poster: T.shape({
      url: T.string
    }),
    display: T.shape({
      fullscreen: T.bool.isRequired
    }).isRequired
  }
}

export {
  ResourceNode
}
