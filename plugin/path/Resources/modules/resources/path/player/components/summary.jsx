import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import {trans} from '#/main/core/translation'
import {NavLink} from '#/main/core/router'
import {TooltipAction} from '#/main/core/layout/button/components/tooltip-action.jsx'

const SummaryHeader = props =>
  <header className="summary-header">
    <h3 className="summary-title">
      <span className="fa fa-fw fa-ellipsis-v" />

      {trans('summary')}
    </h3>

    <div className="summary-controls">
      <TooltipAction
        id="path-summary-pin"
        position="bottom"
        className="btn-link summary-control"
        icon="fa fa-fw fa-map-pin"
        label={trans('summary_pin')}
        action={props.togglePin}
      />

      <TooltipAction
        id="path-summary-open"
        position="bottom"
        className="btn-link summary-control"
        icon="fa fa-fw fa-chevron-left"
        label={trans('summary_open')}
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

const SummarySteps = props =>
  <ul>
    {props.steps.map(step =>
      <li key={step.id}>
        <NavLink to={`/play/${step.id}`}>
          {step.title}
        </NavLink>

        {step.children && 0 !== step.children.length &&
          <SummarySteps
            steps={step.children}
          />
        }
      </li>
    )}
  </ul>

SummarySteps.propTypes = {
  steps: T.arrayOf(T.shape({

  })).isRequired
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

    <SummarySteps
      steps={props.steps}
    />
  </aside>

Summary.propTypes = {
  opened: T.bool,
  pinned: T.bool,
  steps: T.arrayOf(T.shape({
    // step
  })),
  togglePin: T.func.isRequired,
  toggleOpen: T.func.isRequired
}

Summary.defaultProps = {
  opened: false,
  pinned: false,
  steps: []
}

export {
  Summary
}
