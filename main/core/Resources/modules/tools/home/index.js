import {bootstrap} from '#/main/core/scaffolding/bootstrap'

import {HomeTool} from '#/main/core/tools/home/components/tool'
import {reducer} from '#/main/core/tools/home/reducer'

bootstrap(
  '.home-container',
  HomeTool,
  reducer
)
