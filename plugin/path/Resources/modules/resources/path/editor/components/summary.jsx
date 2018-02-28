import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/core/translation'
import {NavLink} from '#/main/core/router'
import {TooltipAction} from '#/main/core/layout/button/components/tooltip-action.jsx'

import {PathSummary} from '#/plugin/path/resources/path/components/summary.jsx'

const SummaryStep = props =>
  <li className="summary-link">
    <div className="tree-item">
      <NavLink to={`/edit/${props.step.id}`}>
        <span className="step-progression fa fa-circle" />

        {props.step.title}
      </NavLink>

      <div className="step-actions">
        <TooltipAction
          id={`step-${props.step.id}-add`}
          position="bottom"
          className="btn-link btn-summary"
          icon="fa fa-fw fa-plus"
          label={trans('step_add_child', {}, 'path')}
          action={() => props.addStep(props.step.id)}
        />

        <TooltipAction
          id={`step-${props.step.id}-delete`}
          position="bottom"
          className="btn-link btn-summary"
          icon="fa fa-fw fa-trash-o"
          label={trans('delete')}
          action={() => props.removeStep(props.step.id)}
        />
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
    id: T.string.isRequired,
    title: T.string,
    children: T.array
  }).isRequired,
  addStep: T.func.isRequired,
  removeStep: T.func.isRequired
}

const Summary = props =>
  <PathSummary>
    <ul className="summary">
      <li className="summary-link">
        <NavLink to="/edit/parameters">
          <span className="fa fa-cog" />
          {trans('parameters')}
        </NavLink>
      </li>

      {props.steps.map(step =>
        <SummaryStep
          key={`summary-step-${step.id}`}
          step={step}
          addStep={props.addStep}
          removeStep={props.removeStep}
        />
      )}

      <li className="summary-link">
        <button
          type="button"
          className="btn btn-link"
          onClick={() => props.addStep(null)}
        >
          <span className="fa fa-plus" />

          {trans('step_add', {}, 'path')}
        </button>
      </li>
    </ul>
  </PathSummary>

Summary.propTypes = {
  steps: T.array.isRequired,
  addStep: T.func.isRequired,
  removeStep: T.func.isRequired
}

export {
  Summary
}
