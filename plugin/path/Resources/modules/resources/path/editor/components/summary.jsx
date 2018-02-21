import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import {trans} from '#/main/core/translation'
import {NavLink} from '#/main/core/router'
import {TooltipAction} from '#/main/core/layout/button/components/tooltip-action.jsx'

const SummaryStep = props =>
  <li className="summary-link">
    <div className="tree-item">
      <NavLink to={`/edit/${props.step.id}`}>
        <span className="fa fa-fw fa-circle"/>
        {props.step.title}
      </NavLink>
      <div className="step-actions">
        <button
          type="button"
          className="btn btn-link"
          onClick={() => props.addStep(props.step.id)}
        >
          <span className="fa fa-fw fa-plus"/>
        </button>
        <button
          type="button"
          className="btn btn-link"
          onClick={() => props.removeStep(props.step.id)}
        >
          <span className="fa fa-fw fa-trash-o"/>
        </button>
      </div>
    </div>
    {props.step.children.length > 0 &&
      <ul className="step-children">
        {props.step.children.map(child =>
          <SummaryStep
            key={`summary-step-${child.id}`}
            step={child}
            addStep={props.addStep}
            removeStep={props.removeStep}
          />
        )}
      </ul>
    }
  </li>

SummaryStep.propTypes = {
  step: T.shape({
    title: T.string,
    children: T.array
  }).isRequired,
  addStep: T.func.isRequired,
  removeStep: T.func.isRequired
}

const SummaryHeader = props =>
  <header className="summary-header">
    <h3 className="summary-title">
      <span className="fa fa-fw fa-ellipsis-v" />
      {trans('summary', {}, 'path')}
    </h3>

    <div className="summary-controls">
      <TooltipAction
        id="path-summary-pin"
        position="bottom"
        className="btn-link summary-control"
        icon="fa fa-fw fa-map-pin"
        label={trans('summary_pin', {}, 'path')}
        action={props.togglePin}
      />

      <TooltipAction
        id="path-summary-open"
        position="bottom"
        className="btn-link summary-control"
        icon={classes('fa fa-fw', {'fa-chevron-left': props.opened, 'fa-chevron-right': !props.opened})}
        label={trans('summary_open', {}, 'path')}
        action={props.toggleOpen}
      />
    </div>
  </header>

SummaryHeader.propTypes = {
  opened: T.bool.isRequired,
  pinned: T.bool.isRequired,
  toggleOpen: T.func.isRequired,
  togglePin: T.func.isRequired
}

const Summary = props =>
  <aside className={classes('summary-container', {
    opened: props.opened,
    pinned: props.pinned
  })}>
    <SummaryHeader
      opened={props.opened}
      pinned={props.pinned}
      toggleOpen={props.toggleOpen}
      togglePin={props.togglePin}
    />
    <nav className="path-summary-tree">
      <ul className="tree">
        <li className="summary-link">
          <div className="tree-item">
            <NavLink to="/edit/parameters">
              <span className="fa fa-fw fa-cog"/>
              {trans('parameters', {}, 'platform')}
            </NavLink>
            <div className="step-actions">
              <button
                type="button"
                className="btn btn-link"
                onClick={() => props.addStep(null)}
              >
                <span className="fa fa-fw fa-plus"/>
              </button>
            </div>
          </div>
        </li>
        {props.steps.map(step =>
          <SummaryStep
            key={`summary-step-${step.id}`}
            step={step}
            addStep={props.addStep}
            removeStep={props.removeStep}
          />
        )}
      </ul>
    </nav>
  </aside>

Summary.propTypes = {
  steps: T.array.isRequired,
  opened: T.bool.isRequired,
  pinned: T.bool.isRequired,
  toggleOpen: T.func.isRequired,
  togglePin: T.func.isRequired,
  addStep: T.func.isRequired,
  removeStep: T.func.isRequired
}

export {
  Summary
}
