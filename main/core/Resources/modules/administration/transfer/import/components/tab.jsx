import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {Routes, navigate} from '#/main/core/router'
import {PageActions} from '#/main/core/layout/page/components/page-actions.jsx'
import {FormContainer} from '#/main/core/data/form/containers/form.jsx'
import {FormPageActionsContainer} from '#/main/core/data/form/containers/page-actions.jsx'
import {select as formSelect} from '#/main/core/data/form/selectors'

import {select} from '#/main/core/administration/transfer/selectors'
import {TransferNav} from '#/main/core/administration/transfer/components/nav.jsx'
import {FlatSchemaExplain} from '#/main/core/administration/transfer/import/components/explain.jsx'
import {constants} from '#/main/core/administration/transfer/import/constants'

const ImportActions = () =>
  <PageActions>
    <FormPageActionsContainer
      formName="import"
      target={['apiv2_transfer_execute']}
      opened={true}
    />
  </PageActions>

const ImportComponent = props =>
  <section>
    <FormContainer
      level={3}
      name="import"
      sections={[
        {
          id: 'general',
          title: trans('general'),
          primary: true,
          fields: [
            {
              name: 'format',
              type: 'enum',
              label: trans('format'),
              required: true,
              options: {
                choices: Object.keys(constants.IMPORT_FORMATS).reduce((acc, format) => Object.assign({}, acc, {[format]: trans(format)}), {})
              }
            }
          ],
          advanced: props.import.format && constants.IMPORT_FORMATS[props.import.format].configure && 0 !== constants.IMPORT_FORMATS[props.import.format].configure && {
            fields: props.import.format ? constants.IMPORT_FORMATS[props.import.format].configure : []
          }
        }, {
          id: 'data',
          icon: 'fa fa-fw fa-database',
          title: trans('data_to_import'),
          defaultOpened: true,
          fields: [
            {
              name: 'data.type',
              type: 'enum',
              label: trans('type'),
              required: true,
              options: {
                noEmpty: true,
                choices: {
                  file: trans('file'),
                  raw: trans('data_raw')
                }
              }
            }, {
              name: 'content',
              type: 'code',
              required: true,
              displayed: props.import.data && 'raw' === props.import.data.type,
              label: trans('content'),
              hideLabel: true,
              options: {
                mode: 'json',
                minRows: 10
              }
            }, {
              name: 'content',
              type: 'file',
              required: true,
              hideLabel: true,
              displayed: props.import.data && 'file' === props.import.data.type,
              label: trans('file'),
              options: {
                multiple: false
              }
            }
          ]
        }
      ]}
    />

    <div className="row">
      <div className="col-md-3">
        <TransferNav
          prefix="/import"
          entities={Object.keys(props.explanation)}
        />
      </div>

      <div className="col-md-9">
        <FormContainer
          level={3}
          name="import"
          sections={[
            {
              id: 'import-action',
              title: trans('import-action'),
              primary: true,
              fields: [
                {
                  name: 'action',
                  type: 'enum',
                  label: trans('action'),
                  onChange: (value) => navigate('/import/' + props.match.params.entity + '/' +  value.substring(value.indexOf('_') + 1)),
                  required: true,
                  options: {
                    choices: Object.keys(props.explanation[props.match.params.entity]).reduce((o, key) =>
                      Object.assign(o, {[props.match.params.entity + '_' + key]: trans(key)}), {})
                  }
                }
              ]
            }
          ]}
        />

        <Routes
          routes={[{
            path: '/import/:entity/:action',
            exact: true,
            component: FlatSchemaExplain
          }]}
        />
      </div>
    </div>
  </section>

ImportComponent.propTypes = {
  import: T.shape({
    format: T.oneOf(['csv', 'json']),
    data: T.shape({
      type: T.oneOf(['file', 'raw']),
      content: T.any
    }),
    entity: T.string,
    action: T.string
  })
}

const Import = connect(
  state => ({
    import: formSelect.data(formSelect.form(state, 'import')),
    explanation: select.explanation(state)
  })
)(ImportComponent)

export {
  Import,
  ImportActions
}
