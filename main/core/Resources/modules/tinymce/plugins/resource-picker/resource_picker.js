//import tinymce from '../tinymce'
import home from '../../../_old/home/home'
import modal from '../../../_old/modal'
import $ from 'jquery'
import _ from 'underscore'

var tinymce = window.tinymce
var resourceManager = window.Claroline.ResourceManager
var buttons = tinymce.claroline.buttons || {}

/**
 * This method is fired when one or more resources are added to the editor
 * with a resource picker.
 *
 * @param nodes An array of resource nodes.
 *
 */
buttons.resourcePickerCallBack = function (nodes, currentDirectoryId, isWidget) {
  if (!isWidget) {
    // if it's not a resource node...
    var nodeId = _.keys(nodes)[0]
    var mimeType = nodes[_.keys(nodes)][2] !== '' ? nodes[_.keys(nodes)][2] : 'unknown/mimetype'
    var openInNewTab = tinymce.activeEditor.getParam('picker').openResourcesInNewTab ? '1' : '0'

    $.ajax(home.path + 'resource/embed/' + nodeId + '/' + mimeType + '/' + openInNewTab)
      .done(function (data) {
        tinymce.activeEditor.insertContent(data)
        if (!tinymce.activeEditor.plugins.fullscreen.isFullscreen()) {
          tinymce.claroline.editorChange(tinymce.activeEditor)
        }
      })
      .error(function () {
        modal.error()
      })
  } else {
    var workspaceId = nodes[0].parents.workspace
    var homeTabId = nodes[0].parents.tab
    var widgetId = nodes[0].id

    var url = home.path +
      'workspaces/' + workspaceId +
      '/tab/' + homeTabId +
      '/widget/' + widgetId +
      '/embed'

    $.ajax(url)
      .done(function (data) {
        tinymce.activeEditor.insertContent(data)
        if (!tinymce.activeEditor.plugins.fullscreen.isFullscreen()) {
          tinymce.claroline.editorChange(tinymce.activeEditor)
        }
      })
      .error(function () {
        modal.error()
      })
  }
}

/**
 * Open a resource picker from a TinyMCE editor.
 */
buttons.resourcePickerOpen = function () {
  if (!resourceManager.hasPicker('tinyMcePicker')) {
    resourceManager.createPicker('tinyMcePicker', {
      callback: tinymce.claroline.buttons.resourcePickerCallBack,
      isTinyMce: true
    }, true)
  } else {
    resourceManager.picker('tinyMcePicker', 'open')
  }
}
