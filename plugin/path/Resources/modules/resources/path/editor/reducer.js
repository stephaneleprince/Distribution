import {makeFormReducer} from '#/main/core/data/form/reducer'

import {
  STEP_ADD,
  STEP_REMOVE
} from '#/plugin/path/resources/path/editor/actions'

const reducer = makeFormReducer('pathForm')

export {
  reducer
}
