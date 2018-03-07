import {PropTypes as T} from 'prop-types'

const Widget = {
  propTypes: {
    id: T.string.isRequired,
    name: T.string,
    display: T.shape({
      color: T.string,
      background: T.oneOf(['none', 'color', 'image'])
    })
  }
}

export {
  Widget
}
