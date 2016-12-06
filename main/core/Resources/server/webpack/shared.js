const path = require('path')
const paths = require('./paths')
const libraries = require('./libraries')

const externals = () => ({
  'jquery': 'jQuery',
  'claroline/resource-manager': 'ClarolineResourceManager',
  'claroline/tinymce': 'ClarolineTinymce',
  'bundle-configs': 'BundlesConfiguration',
  //angular block
  'angular': 'angular',
  'angular-animate': '"angular-animate"',
  'angular-bootstrap': '"angular-bootstrap"',
  'angular-bootstrap-colorpicker': '"angular-bootstrap-colorpicker"',
  'angular-breadcrumb': '"angular-breadcrumb"',
  'angular-daterangepicker': '"angular-daterangepicker"',
  'angular-datetime': '"angular-datetime"',
  'angular-data-table/release/dataTable.helpers.min': '"angular-data-table/release/dataTable.helpers.min"',
  'angular-dragula/dist/angular-dragula': '"angular-dragula/dist/angular-dragula"',
  'angular-loading-bar': '"angular-loading-bar"',
  'angular-resource': '"angular-resource"',
  'angular-route': '"angular-route"',
  'angular-sanitize': '"angular-sanitize"',
  'angular-strap': '"angular-strap"',
  'angular-toArrayFilter': '"angular-toArrayFilter"',
  'angular-touch': '"angular-touch"',
  'angular-ui-router': '"angular-ui-router"',
  'angular-ui-select': '"angular-ui-select"',
  'angular-ui-tinymce': '"angular-ui-tinymce"',
  'angular-ui-translation': '"angular-ui-translation"',
  'angular-ui-tree': '"angular-ui-tree"',
  'angular-ui-pageslide': '"angular-ui-pageslide"',
  'ng-file-upload': '"ng-file-upload"',
  'at-table/dist/angular-table': '"at-table/dist/angular-table"',
  'angular-dragula': 'registerDragula',
  'angular-strap/dist/angular-strap.min': '"angular-strap/dist/angular-strap.min"', //not used a lot: portfolio
  'angular-strap/dist/angular-strap.tpl.min': '"angular-strap/dist/angular-strap.tpl.min"', //not used a lot: portfolio
  'angular-bootstrap/ui-bootstrap.min': '"angular-bootstrap/ui-bootstrap.min"',
  'angular-bootstrap/ui-bootstrap-tpls.min': '"angular-bootstrap/ui-bootstrap-tpls.min"',
  'angular-gridster/dist/angular-gridster.min.js': '"angular-gridster/dist/angular-gridster.min.js"'
})

const aliases = () => ({
  modernizr$: path.resolve(paths.distribution(), '.modernizrrc')
})

const dllManifests = () => {
  return Object.keys(libraries).map(name => {
    return require(`${paths.output()}/${name}.manifest.json`)
  })
}

module.exports = {
  externals,
  aliases,
  dllManifests
}
