/**
 * Exports lists of modules to be bundled as external "dynamic" libraries
 *
 * (@see webpack DllPlugin and DllReferencePlugin)
 */
module.exports = {
  'angular_dll': [
    'angular',
    'angular/angular.min',
    'angular-animate',
    'angular-bootstrap',
    'angular-bootstrap-colorpicker',
    'angular-breadcrumb',
    'angular-daterangepicker',
    'angular-datetime',
    'angular-data-table/release/dataTable.helpers.min',
    'angular-dragula/dist/angular-dragula',
    'angular-loading-bar',
    'angular-resource',
    'angular-route',
    'angular-sanitize',
    'angular-strap',
    'angular-toArrayFilter',
    'angular-touch',
    'angular-ui-router',
    'angular-ui-select',
    'angular-ui-tinymce',
    'angular-ui-translation',
    'angular-ui-tree',
    'angular-ui-pageslide',
    'ng-file-upload',
    'at-table/dist/angular-table',
    'angular-dragula',
    'angular-strap/dist/angular-strap.min', //not used a lot: portfolio
    'angular-strap/dist/angular-strap.tpl.min', //not used a lot: portfolio
    'angular-bootstrap/ui-bootstrap.min',
    'angular-bootstrap/ui-bootstrap-tpls.min',
    'angular-gridster/dist/angular-gridster.min.js'
  ],
  'es6_shim_dll': [
    'core-js/shim'
  ],
  'pdf_player_dll': [
      'pdfjs-dist/build/pdf.combined'
  ],
  'lodash_dll': [
      'lodash/lodash'
  ],
  'moment_dll': [
      'moment/moment',
      'moment/min/moment-with-locales'
  ],
  'tinymce_dll': [
      'tinymce/tinymce',
      //css
      'tinymce/skins/lightgray/content.min.css',
      'tinymce/skins/lightgray/skin.min.css',
      //themes
      'tinymce/themes/modern/theme',
      //plugins
      'tinymce/plugins/autoresize/plugin',
      'tinymce/plugins/table/plugin',
      'tinymce/plugins/directionality/plugin',
      'tinymce/plugins/template/plugin',
      'tinymce/plugins/textcolor/plugin',
      'tinymce/plugins/visualchars/plugin',
      'tinymce/plugins/fullscreen/plugin',
      'tinymce/plugins/insertdatetime/plugin',
      'tinymce/plugins/media/plugin',
      'tinymce/plugins/preview/plugin',
      'tinymce/plugins/hr/plugin',
      'tinymce/plugins/anchor/plugin',
      'tinymce/plugins/pagebreak/plugin',
      'tinymce/plugins/searchreplace/plugin',
      'tinymce/plugins/wordcount/plugin',
      'tinymce/plugins/advlist/plugin',
      'tinymce/plugins/autolink/plugin',
      'tinymce/plugins/lists/plugin',
      'tinymce/plugins/image/plugin',
      'tinymce/plugins/charmap/plugin',
      'tinymce/plugins/print/plugin',
      'tinymce/plugins/visualblocks/plugin',
      'tinymce/plugins/nonbreaking/plugin',
      'tinymce/plugins/save/plugin',
      'tinymce/plugins/emoticons/plugin',
      'tinymce/plugins/code/plugin',
      'tinymce/plugins/paste/plugin',
       'tinymce/plugins/link/plugin' 
  ],
  'jqueryui_dll': [
      'jquery-ui/jquery-ui',
      'jquery-ui/jquery-ui.min',
      'jquery-ui/ui/draggable',
      'jquery-ui/ui/resizable'
  ],
  'bootstrapui_dll': [
      'bootstrap-daterangepicker',
      'mjolnic-bootstrap-colorpicker/dist/css/bootstrap-colorpicker.min.css',
      'mjolnic-bootstrap-colorpicker/dist/js/bootstrap-colorpicker',
      'eonasdan-bootstrap-datetimepicker',
      'confirm-bootstrap/confirm-bootstrap'
  ],
  'libraries_dll': [
      'underscore',
      'Datejs/build/date'
  ],
  'wavesurfer_dll': [
      'wavesurfer.js/dist/wavesurfer',
      'wavesurfer.js/dist/plugin/wavesurfer.minimap.min',
      'wavesurfer.js/dist/plugin/wavesurfer.timeline.min',
      'wavesurfer.js/dist/plugin/wavesurfer.regions.min'
  ],
  'calendar_dll': [
      'fullcalendar/dist/fullcalendar'
  ]
}
