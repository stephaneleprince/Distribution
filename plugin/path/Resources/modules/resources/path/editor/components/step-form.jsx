import React from 'react'

import {trans} from '#/main/core/translation'
import {PropTypes as T, implementPropTypes} from '#/main/core/scaffolding/prop-types'
import {FormContainer} from '#/main/core/data/form/containers/form.jsx'
import {FormSections, FormSection} from '#/main/core/layout/form/components/form-sections.jsx'

import {Step as StepTypes} from '#/plugin/path/resources/path/prop-types'

const PrimaryResourceSection = props =>
  <div>
    {!props.resource ?
      <div>
        {trans('no_primary_resource', {}, 'path')}
      </div> :
      <div>
        {props.resource.name} [{trans(props.resource.meta.type, {}, 'resource')}]
        <span
          className="fa fa-fw fa-trash-o pointer-hand"
          onClick={() => props.removePrimaryResource(props.stepId)}
        />
      </div>
    }
    <button
      type="button"
      className="btn btn-primary"
      onClick={() => props.pickPrimaryResource(props.stepId)}
    >
      <span className="fa fa-fw fa-plus icon-with-text-right"/>
      {trans('select_primary_resource', {}, 'path')}
    </button>
  </div>

PrimaryResourceSection.propTypes = {
  stepId: T.string.isRequired,
  resource: T.shape({
    id: T.string.isRequired,
    name: T.string.isRequired,
    meta: T.shape({
      type: T.string.isRequired
    }).isRequired
  }),
  pickPrimaryResource: T.func.isRequired,
  removePrimaryResource: T.func.isRequired
}

const SecondaryResourcesSection = props =>
  <div>
    {props.secondaryResources.map(sr =>
      <div key={`secondary-resource-${sr.id}`}>
        {sr.resource.name} [{trans(sr.resource.meta.type, {}, 'resource')}]
        <span
          className="fa fa-fw fa-trash-o pointer-hand"
          onClick={() => props.removeSecondaryResource(props.stepId, sr.id)}
        />
      </div>
    )}
    <button
      type="button"
      className="btn btn-primary"
      onClick={() => props.pickSecondaryResources(props.stepId)}
    >
      <span className="fa fa-fw fa-plus icon-with-text-right"/>
      {trans('select_secondary_resources', {}, 'path')}
    </button>
  </div>

SecondaryResourcesSection.propTypes = {
  stepId: T.string.isRequired,
  secondaryResources: T.array,
  pickSecondaryResources: T.func.isRequired,
  removeSecondaryResource: T.func.isRequired
}

const StepForm = props =>
  <FormContainer
    level={3}
    displayLevel={2}
    name="pathForm"
    title={props.title}
    dataPart={props.stepPath}
    sections={[
      {
        id: 'info',
        title: trans('information'),
        icon: 'fa fa-fw fa-info',
        fields: [
          {
            name: 'title',
            type: 'string',
            label: trans('title'),
            required: true
          }, {
            name: 'description',
            type: 'html',
            label: trans('description')
          }
        ]
      }, {
        id: 'display',
        icon: 'fa fa-fw fa-desktop',
        title: trans('display_parameters'),
        fields: [
          {
            name: 'poster',
            type: 'image',
            label: trans('poster'),
            options: {
              ratio: '3:1'
            }
          }, {
            name: 'display.numbering',
            type: 'string',
            label: trans('step_numbering', {}, 'path'),
            displayed: props.customNumbering
          }
        ]
      }
    ]}
  >
    <FormSections level={3}>
      <FormSection
        id="primary-resource"
        className="embedded-list-section"
        icon="fa fa-fw fa-folder-open-o"
        title={trans('primary_resource', {}, 'path')}
      >
        <PrimaryResourceSection
          stepId={props.id}
          resource={props.primaryResource}
          pickPrimaryResource={props.pickPrimaryResource}
          removePrimaryResource={props.removePrimaryResource}
        />
      </FormSection>
      <FormSection
        id="secondary-resources"
        className="embedded-list-section"
        icon="fa fa-fw fa-folder-open"
        title={trans('secondary_resources', {}, 'path')}
      >
        <SecondaryResourcesSection
          stepId={props.id}
          secondaryResources={props.secondaryResources}
          pickSecondaryResources={props.pickSecondaryResources}
          removeSecondaryResource={props.removeSecondaryResource}
        />
      </FormSection>
    </FormSections>
  </FormContainer>

implementPropTypes(StepForm, StepTypes, {
  stepPath: T.string.isRequired,
  numbering: T.string,
  customNumbering: T.bool,
  pickPrimaryResource: T.func.isRequired,
  removePrimaryResource: T.func.isRequired,
  pickSecondaryResources: T.func.isRequired,
  removeSecondaryResource: T.func.isRequired
}, {
  customNumbering: false
})

export {
  StepForm
}
