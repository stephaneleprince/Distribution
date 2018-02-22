import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {select as formSelect} from '#/main/core/data/form/selectors'
import {Routes} from '#/main/core/router'
import {FormContainer} from '#/main/core/data/form/containers/form.jsx'

import {select} from '#/plugin/path/resources/path/selectors'
import {select as editorSelect} from '#/plugin/path/resources/path/editor/selectors'
import {actions} from '#/plugin/path/resources/path/actions'
import {actions as editorActions} from '#/plugin/path/resources/path/editor/actions'
import {Summary} from '#/plugin/path/resources/path/editor/components/summary.jsx'
import {ParametersForm} from '#/plugin/path/resources/path/editor/components/parameters-form.jsx'
import {StepForm} from '#/plugin/path/resources/path/editor/components/step-form.jsx'

const EditorComponent = props =>
  <section className="resource-section">
    <h2>{trans('configuration', {}, 'platform')}</h2>

    <Summary
      steps={props.path.steps}
      opened={props.summaryOpened}
      pinned={props.summaryPinned}
      toggleOpen={props.toggleSummaryOpen}
      togglePin={props.toggleSummaryPin}
      addStep={props.addStep}
      removeStep={props.removeStep}
    />

    <div className="content-container">
      <Routes
        routes={
          [{
            path: `/edit/parameters`,
            render: () => <ParametersForm path={props.path}/>
          }].concat(props.steps.map(s => ({
            path: `/edit/${s.id}`,
            render: () => <StepForm stepId={s.id} path={props.path}/>
          })))
        }
      />

      <nav className="path-navigation">
        <button className="btn btn-lg btn-link">
          <span className="fa fa-angle-double-left icon-with-text-right" />
          {trans('previous', {}, 'platform')}
        </button>
        <button className="btn btn-lg btn-link">
          {trans('next', {}, 'platform')}
          <span className="fa fa-angle-double-right icon-with-text-left" />
        </button>
      </nav>
    </div>
  </section>

EditorComponent.propTypes = {
  path: T.object,
  steps: T.array,
  summaryOpened: T.bool.isRequired,
  summaryPinned: T.bool.isRequired,
  addStep: T.func.isRequired,
  removeStep: T.func.isRequired,
  toggleSummaryOpen: T.func.isRequired,
  toggleSummaryPin: T.func.isRequired
}

const Editor = connect(
  state => ({
    path: formSelect.data(formSelect.form(state, 'pathForm')),
    steps: editorSelect.flatStepsForm(state),
    summaryOpened: select.summaryOpened(state),
    summaryPinned: select.summaryPinned(state)
  }),
  dispatch => ({
    addStep(parentId) {
      dispatch(editorActions.addStep(parentId))
    },
    removeStep(id) {
      dispatch(editorActions.removeStep(id))
    },
    toggleSummaryOpen() {
      dispatch(actions.toggleSummaryOpen())
    },
    toggleSummaryPin() {
      dispatch(actions.toggleSummaryPin())
    }
  })
)(EditorComponent)

export {
  Editor
}
