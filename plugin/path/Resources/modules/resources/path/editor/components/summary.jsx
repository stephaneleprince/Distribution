import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/core/translation'
import {NavLink} from '#/main/core/router'

import {PathSummary} from '#/plugin/path/resources/path/components/summary.jsx'

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

const Summary = props =>
  <PathSummary>
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
  </PathSummary>

Summary.propTypes = {
  steps: T.array.isRequired,
  addStep: T.func.isRequired,
  removeStep: T.func.isRequired
}

export {
  Summary
}
