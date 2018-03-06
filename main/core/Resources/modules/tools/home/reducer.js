import {makePageReducer} from '#/main/core/layout/page/reducer'

import {reducer as editorReducer} from '#/main/core/tools/home/editor/reducer'

const reducer = makePageReducer({}, {
  editor: editorReducer
})

export {
  reducer
}
