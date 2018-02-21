import {makeReducer, combineReducers} from '#/main/core/scaffolding/reducer'
import {makeResourceReducer} from '#/main/core/resource/reducer'

import {FORM_SUBMIT_SUCCESS} from '#/main/core/data/form/actions'

import {
  SUMMARY_PIN_TOGGLE,
  SUMMARY_OPEN_TOGGLE
} from '#/plugin/path/resources/path/actions'

import {reducer as editorReducer} from '#/plugin/path/resources/path/editor/reducer'

const reducer = makeResourceReducer({}, {
  summary: combineReducers({
    pinned: makeReducer(false, {
      [SUMMARY_PIN_TOGGLE]: (state) => !state
    }),
    opened: makeReducer(false, {
      [SUMMARY_OPEN_TOGGLE]: (state) => !state
    })
  }),
  pathForm: editorReducer,
  path: makeReducer({}, {
    // replaces path data after success updates
    [FORM_SUBMIT_SUCCESS+'/pathForm']: (state, action) => action.updatedData
  })
})

export {
  reducer
}
