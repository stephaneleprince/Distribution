/**
 * Exports lists of modules to be bundled as external "dynamic" libraries
 *
 * (@see webpack DllPlugin and DllReferencePlugin)
 */
module.exports = {
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
