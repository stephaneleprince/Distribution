//const paths = require('./paths')

var libs =
  [
    'angular',
    'angular-animate',
    'angular-bootstrap',
    'angular-bootstrap-colorpicker',
    'angular-breadcrumb',
    'angular-daterangepicker',
    'angular-datetime',
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
    'angular-strap'
]

libs = libs.reduce((acc, lib) => {
    acc[lib] = [lib]
    return acc
}, {})

libs['angular-dragula'] = [__dirname + '/externals/angular-dragula.js']
libs['at-table'] = [__dirname + '/externals/at-table.js']
libs['angular-gridster'] = [__dirname + '/externals/angular-gridster.js']
libs['angular-data-table'] = [__dirname + '/externals/angular-data-table.js']

module.exports = libs
