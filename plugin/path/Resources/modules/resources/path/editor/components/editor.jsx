import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {actions as modalActions} from '#/main/core/layout/modal/actions'
import {MODAL_DATA_PICKER} from '#/main/core/data/list/modals'
import {select as formSelect} from '#/main/core/data/form/selectors'
import {Routes} from '#/main/core/router'

import {select} from '#/plugin/path/resources/path/editor/selectors'
import {actions} from '#/plugin/path/resources/path/editor/actions'
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
                  pickPrimaryResource={stepId => props.pickPrimaryResource(stepId, props.resourceTypes)}
                  removePrimaryResource={props.removePrimaryResource}
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
  resourceTypes: T.array,
  addStep: T.func.isRequired,
  removeStep: T.func.isRequired,
  pickPrimaryResource: T.func.isRequired,
  removePrimaryResource: T.func.isRequired
}

const Editor = connect(
  state => ({
    path: formSelect.data(formSelect.form(state, 'pathForm')),
    steps: select.flatStepsForm(state),
    resourceTypes: select.resourceTypes(state)
  }),
  dispatch => ({
    addStep(parentId) {
      dispatch(actions.addStep(parentId))
    },
    removeStep(id) {
      dispatch(actions.removeStep(id))
    },
    pickPrimaryResource(stepId, resourceTypes) {
      dispatch(modalActions.showModal(MODAL_DATA_PICKER, {
        icon: 'fa fa-fw fa-folder-open',
        title: trans('select_primary_resource', {}, 'path'),
        confirmText: trans('select', {}, 'path'),
        name: 'resourcesPicker',
        onlyId: false,
        definition: [
          {
            name: 'name',
            type: 'string',
            label: trans('name'),
            displayed: true,
            primary: true
          },
          {
            name: 'resourceType',
            label: trans('type'),
            displayable: false,
            displayed: false,
            type: 'enum',
            options: {
              choices: resourceTypes.filter(rt => rt.name != 'directory').reduce(
                (choices, rt) => Object.assign(choices, {[rt.name]: trans(rt.name, {}, 'resource')}),
                {}
              )
            }
          },
          {
            name: 'meta.type',
            type: 'string',
            label: trans('type'),
            displayed: true,
            filterable: false,
            renderer: (rowData) => trans(rowData.meta.type, {}, 'resource')
          },
          {
            name: 'workspace.name',
            type: 'string',
            label: trans('workspace'),
            displayed: true
          },
          {
            name: 'meta.parent.name',
            type: 'string',
            label: trans('parent'),
            displayed: true
          }
        ],
        card: (row) => ({
          icon: 'fa fa-folder-open',
          title: row.name,
          subtitle: row.code
        }),
        fetch: {
          url: ['apiv2_resources_picker'],
          autoload: true
        },
        handleSelect: (selected) => dispatch(actions.updatePrimaryResource(stepId, selected[0]))
      }))
    },
    removePrimaryResource(stepId) {
      dispatch(actions.updatePrimaryResource(stepId, null))
    }
  })
)(EditorComponent)

export {
  Editor
}
