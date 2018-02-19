import {makeReducer} from '#/main/core/scaffolding/reducer'
import {makeResourceReducer} from '#/main/core/resource/reducer'

import {FORM_SUBMIT_SUCCESS} from '#/main/core/data/form/actions'

// app reducers
import {reducer as editorReducer} from '#/plugin/path/resources/path/editor/reducer'

const pathReducer = makeReducer({}, {
  // replaces path data after success updates
  [FORM_SUBMIT_SUCCESS+'/pathForm']: (state, action) => action.updatedData
})

const reducer = makeResourceReducer({}, {
  path: pathReducer,
  pathForm: editorReducer
})

export {
  reducer
}
