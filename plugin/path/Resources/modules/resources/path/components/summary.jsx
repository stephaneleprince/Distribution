import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import classes from 'classnames'

import {trans} from '#/main/core/translation'
import {TooltipAction} from '#/main/core/layout/button/components/tooltip-action.jsx'

import {actions} from '#/plugin/path/resources/path/actions'
import {select} from '#/plugin/path/resources/path/selectors'

const SummaryHeader = props =>
  <header className="summary-header">
    <h3 className="h2 summary-title">
      <span className="fa fa-fw fa-ellipsis-v" />

      {trans('summary')}
    </h3>

    <div className="summary-controls">
      {props.opened &&
        <TooltipAction
          id="path-summary-pin"
          position={props.opened ? 'bottom':'right'}
          className={classes('btn-link summary-control hidden-xs hidden-sm', {
            active: props.pinned
          })}
          icon="fa fa-fw fa-map-pin"
          label={trans(props.pinned ? 'unpin_summary':'pin_summary', {}, 'path')}
          action={props.togglePin}
        />
      }

      <TooltipAction
        id="path-summary-open"
        position={props.opened ? 'bottom':'right'}
        className="btn-link summary-control"
        icon={classes('fa fa-fw', {
          'fa-chevron-left': props.opened,
          'fa-chevron-right': !props.opened
        })}
        label={trans(props.opened ? 'close_summary':'open_summary', {}, 'path')}
        action={props.toggleOpen}
      />
    </div>
  </header>

SummaryHeader.propTypes = {
  opened: T.bool,
  pinned: T.bool,
  togglePin: T.func.isRequired,
  toggleOpen: T.func.isRequired
}

const Summary = props =>
  <aside className={classes('summary-container', {
    opened: props.opened,
    pinned: props.pinned
  })}>
    <SummaryHeader
      opened={props.opened}
      pinned={props.pinned}
      togglePin={props.togglePin}
      toggleOpen={props.toggleOpen}
    />

    {props.children}
  </aside>

Summary.propTypes = {
  opened: T.bool.isRequired,
  pinned: T.bool.isRequired,
  togglePin: T.func.isRequired,
  toggleOpen: T.func.isRequired,
  children: T.node
}

const PathSummary = connect(
  state => ({
    opened: select.summaryOpened(state),
    pinned: select.summaryPinned(state)
  }),
  dispatch => ({
    toggleOpen() {
      dispatch(actions.toggleSummaryOpen())
    },
    togglePin() {
      dispatch(actions.toggleSummaryPin())
    }
  })
)(Summary)

export {
  PathSummary
}
