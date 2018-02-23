import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {select as formSelect} from '#/main/core/data/form/selectors'
import {Routes} from '#/main/core/router'

import {select as editorSelect} from '#/plugin/path/resources/path/editor/selectors'
import {actions as editorActions} from '#/plugin/path/resources/path/editor/actions'
import {PathCurrent} from '#/plugin/path/resources/path/components/current.jsx'
import {Summary} from '#/plugin/path/resources/path/editor/components/summary.jsx'
import {ParametersForm} from '#/plugin/path/resources/path/editor/components/parameters-form.jsx'
import {StepForm} from '#/plugin/path/resources/path/editor/components/step-form.jsx'
import {getFormDataPart} from '#/plugin/path/resources/path/editor/utils'

const EditorComponent = props =>
  <section className="resource-section">
    <h2 className="sr-only">{trans('configuration')}</h2>

    <Summary
      steps={props.path.steps}
      addStep={props.addStep}
      removeStep={props.removeStep}
    />

    <Routes
      routes={[
        {
          path: '/edit/parameters',
          render: () => <ParametersForm path={props.path}/>
        }, {
          path: '/edit/:id',
          render: (routeProps) => {
            const step = props.steps.find(step => routeProps.match.params.id === step.id)

            return (
              <PathCurrent
                prefix="/edit"
                current={step}
                all={props.steps}
              >
                <StepForm
                  {...step}
                  stepPath={getFormDataPart(step.id, props.path.steps)}
                />
              </PathCurrent>
            )
          }
        }
      ]}
    />
  </section>

EditorComponent.propTypes = {
  path: T.object,
  steps: T.array,
  addStep: T.func.isRequired,
  removeStep: T.func.isRequired
}

const Editor = connect(
  state => ({
    path: formSelect.data(formSelect.form(state, 'pathForm')),
    steps: editorSelect.flatStepsForm(state)
  }),
  dispatch => ({
    addStep(parentId) {
      dispatch(editorActions.addStep(parentId))
    },
    removeStep(id) {
      dispatch(editorActions.removeStep(id))
    }
  })
)(EditorComponent)

export {
  Editor
}
