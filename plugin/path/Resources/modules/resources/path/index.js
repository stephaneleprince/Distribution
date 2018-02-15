import {bootstrap} from '#/main/core/scaffolding/bootstrap'
import {registerModals} from '#/main/core/layout/modal'

import {reducer} from '#/plugin/path/resources/path/reducer'

import {PathResource} from '#/plugin/path/resources/path/components/resource.jsx'

// mount the react application
bootstrap(
  // app DOM container (also holds initial app data as data attributes)
  '.path-container',

  // app main component (accepts either a `routedApp` or a `ReactComponent`)
  PathResource,

  // app store configuration
  reducer
)
