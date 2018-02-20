import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {select as formSelect} from '#/main/core/data/form/selectors'
import {actions as formActions} from '#/main/core/data/form/actions'
import {FormContainer} from '#/main/core/data/form/containers/form.jsx'

import {actions} from '#/plugin/path/resources/path/editor/actions'
import {select} from '#/plugin/path/resources/path/editor/selectors'
import {getFormDataPart} from '#/plugin/path/resources/path/editor/utils'

const SummaryStep = props =>
  <li className="summary-link">
    <div className="tree-item">
      <div
        className="step"
        onClick={() => props.openSection(props.step.id)}
      >
        <span className="step-progression fa fa-fw fa-circle"/>
        <span className="step-name">
          {props.step.title}
        </span>
      </div>
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
            openSection={props.openSection}
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
  openSection: T.func.isRequired,
  addStep: T.func.isRequired,
  removeStep: T.func.isRequired
}

const Summary = props =>
  <aside className="summary-container opened pinned">
    <header className="summary-header">
      <h2 className="summary-title">
        <span className="fa fa-fw fa-ellipsis-v"/>
        {trans('summary', {}, 'path_wizards')}
      </h2>
      <div className="summary-controls">
        <button
          type="button"
          className="summary-control summary-control-pin btn btn-link"
        >
          <span className="fa fa-fw fa-map-pin"/>
        </button>
        <button
          type="button"
          className="summary-control btn btn-link"
        >
          <span className="fa fa-fw fa-chevron-left"/>
        </button>
      </div>
    </header>
    <nav className="path-summary-tree">
      <ul className="tree">
        <li className="summary-link">
          <div className="tree-item">
            <div
              className="step"
              onClick={() => props.openSection('parameters')}
            >
              <span className="step-progression fa fa-fw fa-circle"/>
              <span className="step-name">
                {trans('parameters', {}, 'platform')}
              </span>
            </div>
          </div>
        </li>
        {props.path.steps.map(step =>
          <SummaryStep
            key={`summary-step-${step.id}`}
            step={step}
            openSection={props.openSection}
            addStep={props.addStep}
            removeStep={props.removeStep}
          />
        )}
      </ul>
      <button
        className="btn btn-primary"
        onClick={() => props.addStep(null)}
      >
        {trans('step_add_child', {}, 'path_wizards')}
      </button>
    </nav>
  </aside>

const StepForm = props =>
  <FormContainer
    level={3}
    name="pathForm"
    className="content-container"
    dataPart={getFormDataPart(props.currentSection, props.path.steps)}
    sections={[{
      id: 'step',
      title: 'step',
      fields: [
        {
          name: 'title',
          type: 'string',
          label: trans('title', {}, 'platform'),
          required: true
        },
        {
          name: 'description',
          type: 'html',
          label: trans('description', {}, 'platform'),
          required: false
        }
      ]
    }]}
  />

const EditorComponent = props =>
  <section className="resource-section">
    <h2 className="h-first">{trans('configuration', {}, 'platform')}</h2>
    <Summary {...props}/>
    {props.currentSection === 'parameters' ?
      <FormContainer
        level={3}
        name="pathForm"
        className="content-container"
        sections={[{
          id: 'parameters',
          title: trans('parameters', {}, 'platform'),
          fields: [
            {
              name: 'display.showOverview',
              type: 'boolean',
              label: trans('show_overview', {}, 'path_wizards'),
              linked: [
                {
                  name: 'display.description',
                  type: 'html',
                  label: trans('description', {}, 'platform'),
                  displayed: props.path.display.showOverview,
                  required: false
                }
              ]
            },
            {
              name: 'display.showSummary',
              type: 'boolean',
              label: trans('show_summary', {}, 'path_wizards')
            }
          ]
        }]}
      /> :
      <StepForm {...props}/>
    }
  </section>

EditorComponent.propTypes = {
  path: T.object,
  currentSection: T.string,
  addStep: T.func.isRequired,
  removeStep: T.func.isRequired,
  updateProp: T.func.isRequired
}

const Editor = connect(
  state => ({
    path: formSelect.data(formSelect.form(state, 'pathForm')),
    currentSection: select.currentSection(state)
  }),
  dispatch => ({
    openSection(id) {
      dispatch(actions.openSection(id))
    },
    addStep(parentId) {
      dispatch(actions.addStep(parentId))
    },
    removeStep(id) {
      dispatch(actions.removeStep(id))
    },
    updateProp(propName, propValue) {
      dispatch(formActions.updateProp('pathForm', propName, propValue))
    }
  })
)(EditorComponent)

export {
  Editor
}
