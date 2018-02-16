import tinymce from 'tinymce/tinymce'

import {url} from '#/main/core/api'
import {trans} from '#/main/core/translation'

const resourceManager = window.Claroline.ResourceManager

/**
 * Opens a resource picker from a TinyMCE editor.
 */
function openResourcePicker(editor) {
  if (!resourceManager.hasPicker('tinyMcePicker')) {
    resourceManager.createPicker('tinyMcePicker', {
      isTinyMce: true,
      isPickerMultiSelectAllowed: false,
      callback: (nodes, currentDirectoryId, isWidget) => {
        let embedUrl
        if (!isWidget) {
          // embed resourceNode
          const nodeId = Object.keys(nodes)[0]
          const mimeType = nodes[Object.keys(nodes)][2] !== '' ? nodes[Object.keys(nodes)][2] : 'unknown/mimetype'

          embedUrl = url(['claro_resource_embed', {node: nodeId, type: mimeType, extension: mimeType}]) // todo fix params
        } else {
          // embed widget
          const workspaceId = nodes[0].parents.workspace
          const homeTabId = nodes[0].parents.tab
          const widgetId = nodes[0].id

          embedUrl = url(['claro_widget_embed', {workspaceId: workspaceId, homeTabId: homeTabId, widgetId: widgetId}])
        }

        // todo : use fetch instead
        $.ajax(embedUrl)
          .done(function (data) {
            editor.insertContent(data)
          })
          .error(function () {
            editor.notificationManager.open({
              text: trans('error_occured'),
              type: 'error'
            })
          })
      }
    }, true)
  } else {
    resourceManager.picker('tinyMcePicker', 'open')
  }
}

// Register new plugin
tinymce.PluginManager.add('resource-picker', (editor) => {
  // provides an insert menu item
  editor.addMenuItem('resource-picker', {
    icon: 'resource-picker',
    text: trans('resource'),
    context: 'insert',
    onclick: () => openResourcePicker(editor)
  })

  // provides a toolbar button
  editor.addButton('resource-picker', {
    icon: 'resource-picker',
    tooltip: trans('resource'),
    onclick: () => openResourcePicker(editor)
  })
})
