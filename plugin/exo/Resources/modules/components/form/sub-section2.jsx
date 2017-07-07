import React from 'react'
import {PropTypes as T} from 'prop-types'
import Collapse from 'react-bootstrap/lib/Collapse'

export const SubSection2 = props =>
  <div className="sub-section2">
    {props.hidden &&
      <a role="button" onClick={props.toggle}>
        <span className="fa fa-caret-right"/>
        {props.showText} 2
      </a>
    }
      <Collapse in={!props.hidden}>
        <div>
          {props.children}
          <a role="button" onClick={props.toggle}>
            <span className="fa fa-caret-right"/>
            {props.hideText} 2
          </a>
        </div>
      </Collapse>
  </div>

SubSection2.propTypes = {
  hidden: T.bool.isRequired,
  showText: T.string.isRequired,
  hideText: T.string.isRequired,
  toggle: T.func.isRequired,
  children: T.any.isRequired
}
