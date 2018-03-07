import React from 'react'
import {PropTypes as T} from 'prop-types'

const Widget = props =>
  <section className="widget">
    {props.title &&
      <h2 className="h-first widget-title">{props.title}</h2>
    }
  </section>

Widget.propTypes = {
  id: T.string.isRequired,
  title: T.string
}

export {
  Widget
}
