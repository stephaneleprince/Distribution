import $ from 'jquery'

$('#workspace-display-edit-form').on('focus', '#workspace_options_form_backgroundColor', function () {
  $(this).colorpicker()
})

$('#workspace_options_form_backgroundColor').colorpicker().on('changeColor', function (ev) {
  $('body').css('background-color', ev.color.toHex())
})
