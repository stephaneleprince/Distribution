import React from 'react'
import {PropTypes as T} from 'prop-types'
import {NavLink} from '#/main/core/router'

import {trans} from '#/main/core/translation'

const TransferNav = props =>
  <nav className="page-content-nav">
    {props.entities.map(entity =>
      <NavLink
        key={entity}
        to={`${props.prefix}/${entity}`}
        className="page-content-link"
      >
        {trans(entity)}
      </NavLink>
    )}
  </nav>

TransferNav.propTypes = {
  prefix: T.string.isRequired,
  entities: T.arrayOf(T.string).isRequired
}

export {
  TransferNav
}
