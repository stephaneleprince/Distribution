import {trans} from '#/main/core/translation'

import {FlatSchemaExplain, JsonSchemaExplain} from '#/main/core/administration/transfer/import/components/explain.jsx'

const IMPORT_FORMAT_CSV  = 'csv'
const IMPORT_FORMAT_JSON = 'json'

const IMPORT_FORMATS = {
  [IMPORT_FORMAT_CSV]: {
    fileTypes: ['text/csv', 'csv', 'text/plain'],
    configure: [
      {
        name: 'parameters.header',
        type: 'boolean',
        label: trans('Has header line')
      }, {
        name: 'parameters.rowDelimiter',
        type: 'string',
        label: trans('Row delimiter'),
        required: true
      }, {
        name: 'parameters.colDelimiter',
        type: 'string',
        label: trans('Column delimiter'),
        required: true
      }
    ],
    explain: FlatSchemaExplain
  },
  [IMPORT_FORMAT_JSON]: {
    fileTypes: ['application/json', 'json'],
    configure: [],
    explain: JsonSchemaExplain
  }
}

export const constants = {
  IMPORT_FORMAT_CSV,
  IMPORT_FORMAT_JSON,
  IMPORT_FORMATS
}
