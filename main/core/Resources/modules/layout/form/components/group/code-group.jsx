import React from 'react'
import {PropTypes as T, implementPropTypes} from '#/main/core/scaffolding/prop-types'

import {FormGroupWithField as FormGroupWithFieldTypes} from '#/main/core/layout/form/prop-types'
import {FormGroup} from '#/main/core/layout/form/components/group/form-group.jsx'
import {Code} from '#/main/core/layout/form/components/field/code.jsx'

const CodeGroup = props =>
  <FormGroup {...props}>
    <Code {...props} />
  </FormGroup>

implementPropTypes(CodeGroup, FormGroupWithFieldTypes, {
  // more precise value type
  value: T.string,
  // custom props
  mode: T.string.isRequired,
  minRows: T.number
}, {
  value: '',
  minRows: 2
})

export {
  CodeGroup
}
