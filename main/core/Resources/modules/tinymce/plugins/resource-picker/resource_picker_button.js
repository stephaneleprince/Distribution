var tinymce = window.tinymce
var translator = window.Translator

tinymce.PluginManager.add('resourcePicker', function (editor) {
  editor.addButton('resourcePicker', {
    'icon': 'none fa fa-folder-open',
    'classes': 'widget btn',
    'tooltip': translator.trans('resources', {}, 'platform'),
    'onclick': function () {
      tinymce.activeEditor = editor
      tinymce.claroline.buttons.resourcePickerOpen()
    }
  })
})

tinymce.claroline.plugins.resourcePicker = true
