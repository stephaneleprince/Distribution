import {bootstrap} from '#/main/core/scaffolding/bootstrap'

// reducers
import {reducer} from '#/main/core/administration/transfer/reducer'
import {TransferTool} from '#/main/core/administration/transfer/components/tool.jsx'

// mount the react application
bootstrap(
  // app DOM container (also holds initial app data as data attributes)
  '.import-container',

  // app main component
  TransferTool,

  // app store configuration
  reducer,

  // remap data-attributes set on the app DOM container
  (initialData) => {
    return {
      explanation: initialData.explanation
    }
  }
)
