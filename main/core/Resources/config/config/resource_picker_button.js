import tinymce from 'tinymce-dist'

var translator = window.Translator

var callback = function (editor) {
  editor.addButton('resourcePicker', {
    'icon': 'none fa fa-folder-open',
    'classes': 'widget btn',
    'tooltip': translator.trans('resources', {}, 'platform'),
    'onclick': function () {
      tinymce.activeEditor = editor
      tinymce.claroline.buttons.resourcePickerOpen()
    }
  })
}

module.exports = {
    'callback': callback
}
