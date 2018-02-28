import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {asset} from '#/main/core/scaffolding/asset'
import {trans} from '#/main/core/translation'
import {actions as modalActions} from '#/main/core/layout/modal/actions'
import {MODAL_DATA_PICKER} from '#/main/core/data/list/modals'
import {Routes} from '#/main/core/router'
import {constants as listConst} from '#/main/core/data/list/constants'

import {select} from '#/plugin/path/resources/path/editor/selectors'
import {actions} from '#/plugin/path/resources/path/editor/actions'
import {PathCurrent} from '#/plugin/path/resources/path/components/current.jsx'
import {Summary} from '#/plugin/path/resources/path/editor/components/summary.jsx'
import {ParametersForm} from '#/plugin/path/resources/path/editor/components/parameters-form.jsx'
import {StepForm} from '#/plugin/path/resources/path/editor/components/step-form.jsx'
import {Path as PathTypes, Step as StepTypes} from '#/plugin/path/resources/path/prop-types'
import {constants} from '#/plugin/path/resources/path/constants'
import {getNumbering, flattenSteps} from '#/plugin/path/resources/path/utils'
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
      redirect={[
        {from: '/edit/', to: '/edit/parameters', exact: true}
      ]}
      routes={[
        {
          path: '/edit/parameters',
          render: () => {
            const Parameters = <ParametersForm path={props.path} />

            return Parameters
          }
        }, {
          path: '/edit/:id',
          render: (routeProps) => {
            const step = props.steps.find(step => routeProps.match.params.id === step.id)

            const CurrentStep = (
              <PathCurrent
                prefix="/edit"
                current={step}
                all={props.steps}
              >
                <h3 className="h2 step-title">
                  {getNumbering(props.path.display.numbering, props.path.steps, step) &&
                  <span className="step-number">{getNumbering(props.path.display.numbering, props.path.steps, step)}</span>
                  }

                  {step.title}
                </h3>

                <StepForm
                  {...step}
                  numbering={getNumbering(props.path.display.numbering, props.path.steps, step)}
                  customNumbering={constants.NUMBERING_CUSTOM === props.path.display.numbering}
                  stepPath={getFormDataPart(step.id, props.path.steps)}
                  pickPrimaryResource={stepId => props.pickPrimaryResource(stepId, props.resourceTypes)}
                  removePrimaryResource={props.removePrimaryResource}
                  pickSecondaryResources={stepId => props.pickSecondaryResources(stepId, props.resourceTypes)}
                  removeSecondaryResource={props.removeSecondaryResource}
                />
              </PathCurrent>
            )

            return CurrentStep
          }
        }
      ]}
    />
  </section>

EditorComponent.propTypes = {
  resourceTypes: T.array,
  path: T.shape(
    PathTypes.propTypes
  ).isRequired,
  steps: T.arrayOf(T.shape(
    StepTypes.propTypes
  )),
  addStep: T.func.isRequired,
  removeStep: T.func.isRequired,
  pickPrimaryResource: T.func.isRequired,
  removePrimaryResource: T.func.isRequired
}

const Editor = connect(
  state => ({
    resourceTypes: select.resourceTypes(state),
    path: select.path(state),
    steps: flattenSteps(select.steps(state))
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
        display: {
          current: listConst.DISPLAY_TILES_SM,
          available: Object.keys(listConst.DISPLAY_MODES)
        },
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
          poster: asset(row.meta.icon),
          icon: 'fa fa-folder-open',
          title: row.name,
          subtitle: trans(row.meta.type, {}, 'resource'),
          footer:
            <b>{row.workspace.name}</b>
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
    },
    pickSecondaryResources(stepId, resourceTypes) {
      dispatch(modalActions.showModal(MODAL_DATA_PICKER, {
        icon: 'fa fa-fw fa-folder-open',
        title: trans('select_secondary_resources', {}, 'path'),
        confirmText: trans('select', {}, 'path'),
        name: 'resourcesPicker',
        onlyId: false,
        display: {
          current: listConst.DISPLAY_TILES_SM,
          available: Object.keys(listConst.DISPLAY_MODES)
        },
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
          poster: asset(row.meta.icon),
          icon: 'fa fa-folder-open',
          title: row.name,
          subtitle: trans(row.meta.type, {}, 'resource'),
          footer:
            <b>{row.workspace.name}</b>
        }),
        fetch: {
          url: ['apiv2_resources_picker'],
          autoload: true
        },
        handleSelect: (selected) => dispatch(actions.addSecondaryResources(stepId, selected))
      }))
    },
    removeSecondaryResource(stepId, id) {
      dispatch(actions.removeSecondaryResources(stepId, [id]))
    }
  })
)(EditorComponent)

export {
  Editor
}
