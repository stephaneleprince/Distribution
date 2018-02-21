import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {select as formSelect} from '#/main/core/data/form/selectors'
import {Routes} from '#/main/core/router'
import {FormContainer} from '#/main/core/data/form/containers/form.jsx'

import {actions} from '#/plugin/path/resources/path/editor/actions'
import {getFormDataPart} from '#/plugin/path/resources/path/editor/utils'
import {Summary} from '#/plugin/path/resources/path/editor/components/summary.jsx'

const ParametersForm = props =>
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
          label: trans('show_overview', {}, 'path'),
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
          label: trans('show_summary', {}, 'path')
        }
      ]
    }]}
  />

const StepForm = props =>
  <FormContainer
    level={3}
    name="pathForm"
    className="content-container"
    dataPart={getFormDataPart(props.stepId, props.path.steps)}
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

StepForm.propTypes = {
  path: T.shape({
    steps: T.array
  }).isRequired,
  stepId: T.string.isRequired
}

function generateStepsRoutes(steps, path, routes) {
  steps.forEach(s => routes.push({
    path: `/edit/${s.id}`,
    component: () => <StepForm stepId={s.id} path={path}/>
  }))
  steps.forEach(s => {
    if (s.children.length > 0) {
      routes = routes.concat(generateStepsRoutes(s.children, path, routes))
    }
  })

  return routes
}

const EditorComponent = props =>
  <section className="resource-section">
    <h2 className="h-first">{trans('configuration', {}, 'platform')}</h2>

    <Summary
      steps={props.path.steps}
      opened={props.opened}
      pinned={props.pinned}
      toggleOpen={props.toggleOpen}
      togglePin={props.togglePin}
      addStep={props.addStep}
      removeStep={props.removeStep}
    />

    <div className="content-container">
      <Routes
        routes={generateStepsRoutes(props.path.steps, props.path, [{
          path: `/edit/parameters`,
          component: () => <ParametersForm path={props.path}/>
        }])}
      />
    </div>
  </section>

EditorComponent.propTypes = {
  path: T.object
}

EditorComponent.defaultProps = {
  opened: true,
  pinned: true,
  toggleOpen: () => {},
  togglePin: () => {}
}

const Editor = connect(
  state => ({
    path: formSelect.data(formSelect.form(state, 'pathForm'))
  }),
  dispatch => ({
    addStep(parentId) {
      dispatch(actions.addStep(parentId))
    },
    removeStep(id) {
      dispatch(actions.removeStep(id))
    }
  })
)(EditorComponent)

export {
  Editor
}
