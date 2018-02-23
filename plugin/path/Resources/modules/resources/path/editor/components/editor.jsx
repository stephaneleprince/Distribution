import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {actions as modalActions} from '#/main/core/layout/modal/actions'
import {MODAL_DATA_PICKER} from '#/main/core/data/list/modals'
import {select as formSelect} from '#/main/core/data/form/selectors'
import {Routes} from '#/main/core/router'

import {select} from '#/plugin/path/resources/path/selectors'
import {select as editorSelect} from '#/plugin/path/resources/path/editor/selectors'
import {actions} from '#/plugin/path/resources/path/actions'
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
      opened={props.summaryOpened}
      pinned={props.summaryPinned}
      toggleOpen={props.toggleSummaryOpen}
      togglePin={props.toggleSummaryPin}
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
                  pickPrimaryResource={props.pickPrimaryResource}
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
  summaryOpened: T.bool.isRequired,
  summaryPinned: T.bool.isRequired,
  addStep: T.func.isRequired,
  removeStep: T.func.isRequired,
  toggleSummaryOpen: T.func.isRequired,
  toggleSummaryPin: T.func.isRequired,
  pickPrimaryResource: T.func.isRequired,
  removePrimaryResource: T.func.isRequired
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
    },
    pickPrimaryResource(stepId) {
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
            name: 'meta.type',
            type: 'string',
            label: trans('type'),
            displayed: true,
            renderer: (rowData) => trans(rowData.meta.type, {}, 'resource')
          }
        ],
        card: (row) => ({
          icon: 'fa fa-folder-open',
          title: row.name,
          subtitle: row.code
        }),
        fetch: {
          url: ['apiv2_resourcenode_list'],
          autoload: true
        },
        handleSelect: (selected) => dispatch(editorActions.updatePrimaryResource(stepId, selected[0]))
      }))
    },
    removePrimaryResource(stepId) {
      dispatch(editorActions.updatePrimaryResource(stepId, null))
    }
  })
)(EditorComponent)

export {
  Editor
}
