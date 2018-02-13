import {trans} from '#/main/core/translation'
import {string} from '#/main/core/validation'

import {CodeGroup} from '#/main/core/layout/form/components/group/code-group.jsx'

const CODE_TYPE = 'code'

const codeDefinition = {
  meta: {
    type: CODE_TYPE,
    creatable: false,
    icon: 'fa fa-fw fa fa-code',
    label: trans('code'),
    description: trans('code_desc')
  },

  // nothing special to do
  parse: (display) => display,
  // nothing special to do
  render: (raw) => raw,
  validate: (value, options) => string(value, options),
  components: {
    form: CodeGroup
  }
}

export {
  CODE_TYPE,
  codeDefinition
}
