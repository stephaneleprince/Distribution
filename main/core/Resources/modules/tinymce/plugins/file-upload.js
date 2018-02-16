import tinymce from 'tinymce/tinymce'

import {trans} from '#/main/core/translation'

const common = window.Claroline.Common
const modal = window.Claroline.Modal
const resourceManager = window.Claroline.ResourceManager

/**
 * Open a resource picker from a TinyMCE editor.
 */
function openDirectoryPicker() {
  if (!resourceManager.hasPicker('tinyMceDirectoryPicker')) {
    resourceManager.createPicker('tinyMceDirectoryPicker', {
      resourceTypes: ['directory'],
      isDirectorySelectionAllowed: true,
      isPickerMultiSelectAllowed: false,
      callback: (nodes) => {
        let val, path
        for (let id in nodes) {
          if (nodes.hasOwnProperty(id)) {
            val = nodes[id][4]
            path = nodes[id][3]
          }
        }

        //file_form_destination
        let html = '<option value="' + val + '">' + path + '</option>'
        $('#file_form_destination').append(html)
        $('#file_form_destination').val(val)
      }
    }, true)
  } else {
    resourceManager.picker('tinyMceDirectoryPicker', 'open')
  }
}

function uploadFile(editor) {
  modal.fromRoute('claro_upload_modal', null, function(element) {
    element
      .on('click', '.resourcePicker', function() {
        tinymce.claroline.buttons.resourcePickerOpen()
      })
      .on('click', '.filePicker', function() {
        $('#file_form_file').click()
      })
      .on('change', '#file_form_destination', function(event) {
        if ($('#file_form_destination').val() === 'others') {
          openDirectoryPicker()
        }
      })
      .on('change', '#file_form_file', function() {
        common.uploadfile(
          this,
          element,
          $('#file_form_destination').val(),
          tinymce.claroline.buttons.resourcePickerCallBack
        )
      })
  })
}

// Register new plugin
tinymce.PluginManager.add('file-upload', (editor) => {
  // provides an insert menu item
  editor.addMenuItem('file-upload', {
    icon: 'file-upload',
    text: trans('file'),
    context: 'insert',
    onclick: () => uploadFile(editor)
  })

  // provides a toolbar button
  editor.addButton('file-upload', {
    icon: 'file-upload',
    tooltip: trans('upload'),
    onclick: () => uploadFile(editor)
  })
})
