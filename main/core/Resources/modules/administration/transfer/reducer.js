import {makeReducer} from '#/main/core/scaffolding/reducer'
import {makePageReducer} from '#/main/core/layout/page/reducer'

import {reducer as exportReducer} from '#/main/core/administration/transfer/export/reducer'
import {reducer as importReducer} from '#/main/core/administration/transfer/import/reducer'

const reducer = makePageReducer({}, {
  explanation: makeReducer({}, {}),
  import: importReducer,
  export: exportReducer
})

export {
  reducer
}
