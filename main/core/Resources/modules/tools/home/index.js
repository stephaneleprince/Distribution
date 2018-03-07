import {bootstrap} from '#/main/core/scaffolding/bootstrap'

import {registerModals} from '#/main/core/layout/modal'
import {MODAL_ADD_WIDGET, AddWidgetModal} from '#/main/core/tools/home/editor/components/modal/add-widget'
import {MODAL_EDIT_WIDGET, EditWidgetModal} from '#/main/core/tools/home/editor/components/modal/edit-widget'

import {HomeTool} from '#/main/core/tools/home/components/tool'
import {reducer} from '#/main/core/tools/home/reducer'

registerModals([
  [MODAL_ADD_WIDGET,  AddWidgetModal],
  [MODAL_EDIT_WIDGET, EditWidgetModal]
])

bootstrap(
  '.home-container',
  HomeTool,
  reducer
)
