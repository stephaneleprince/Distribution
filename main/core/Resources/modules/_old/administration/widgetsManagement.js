import $ from 'jquery'

/* global Routing */

$('#widgets-table').on('click', '.edit-widget-btn', function (e) {
  e.preventDefault()
  var widgetId = $(this).data('widget-id')

  window.Claroline.Modal.displayForm(
    Routing.generate('claro_widget_edit_form', {'widget': widgetId}),
    refreshPage,
    function () {}
  )
})

var refreshPage = function () {
  window.location.reload()
}
