import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/core/translation'
import {NavLink} from '#/main/core/router'
import {TooltipAction} from '#/main/core/layout/button/components/tooltip-action.jsx'

import {Step as StepTypes} from '#/plugin/path/resources/path/prop-types'
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
          id={`step-${props.step.id}-copy`}
          position="bottom"
          className="btn-link btn-summary"
          icon="fa fa-fw fa-files-o"
          label={trans('copy_step', {}, 'path')}
          action={() => props.copyStep(props.step)}
        />

        {props.copy &&
          <TooltipAction
            id={`step-${props.step.id}-paste`}
            position="bottom"
            className="btn-link btn-summary"
            icon="fa fa-fw fa-clipboard"
            label={trans('add_copied_step', {}, 'path')}
            action={() => {
              props.pasteStep(props.step.id, props.copy)
              props.resetStepCopy()
            }}
          />
        }

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
            copy={props.copy}
            addStep={props.addStep}
            removeStep={props.removeStep}
            copyStep={props.copyStep}
            pasteStep={props.pasteStep}
            resetStepCopy={props.resetStepCopy}
          />
        )}
      </ul>
    }
  </li>

SummaryStep.propTypes = {
  step: T.shape(StepTypes.propTypes).isRequired,
  copy: T.shape(StepTypes.propTypes),
  addStep: T.func.isRequired,
  removeStep: T.func.isRequired,
  copyStep: T.func.isRequired,
  pasteStep: T.func.isRequired,
  resetStepCopy: T.func.isRequired
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
          copy={props.copy}
          addStep={props.addStep}
          removeStep={props.removeStep}
          copyStep={props.copyStep}
          pasteStep={props.pasteStep}
          resetStepCopy={props.resetStepCopy}
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

        {props.copy &&
          <TooltipAction
            id="step-paste"
            position="bottom"
            className="btn-link btn-summary"
            icon="fa fa-fw fa-clipboard"
            label={trans('add_copied_step', {}, 'path')}
            action={() => {
              props.pasteStep(null, props.copy)
              props.resetStepCopy()
            }}
          />
        }
      </li>
    </ul>
  </PathSummary>

Summary.propTypes = {
  steps: T.array.isRequired,
  copy: T.shape(StepTypes.propTypes),
  addStep: T.func.isRequired,
  removeStep: T.func.isRequired,
  copyStep: T.func.isRequired,
  pasteStep: T.func.isRequired,
  resetStepCopy: T.func.isRequired
}

export {
  Summary
}
