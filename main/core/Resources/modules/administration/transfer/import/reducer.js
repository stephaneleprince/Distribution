
import {makeFormReducer} from '#/main/core/data/form/reducer'

const reducer = makeFormReducer('import', {
  data: {
    format: 'csv',
    data: {
      type: 'file'
    }
  }
})

export {
  reducer
}
