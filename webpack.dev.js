const paths = require('./main/core/Resources/server/webpack/paths')
const entries = require('./main/core/Resources/server/webpack/entries')
const shared = require('./main/core/Resources/server/webpack/shared')
const plugins = require('./main/core/Resources/server/webpack/plugins')
const loaders = require('./main/core/Resources/server/webpack/loaders')

module.exports = {
  entry: entries.collectEntries('entry'),
  output: {
    path: paths.output(),
    publicPath: 'http://localhost:8080/dist',
    filename: '[name].js'
  },
  resolve: {
    modules: [
      paths.bower(),
      "node_modules"
    ],
    alias: shared.aliases()
  },
  plugins: [
    plugins.assetsInfoFile(),
    plugins.bowerFileLookup(),
    plugins.distributionShortcut(),
    plugins.clarolineConfiguration(),
    plugins.configShortcut(),
    //plugins.extractExternals(),
    plugins.namedModule(),
    plugins.noCircularDependencies(),
  ],
  module: {
    rules: [
      loaders.jqueryUiNoAmd(),
      loaders.fullcalendarNoAmd(),
      loaders.css(),
      loaders.font(),
      loaders.babel(),
      loaders.loadConfig(),
      loaders.rawHtml(),
      loaders.imageUris(),
      loaders.modernizr(),
      loaders.tinymceImport(),
      loaders.tinymceWrapper(),
      loaders.tinymceJquery(),
      loaders.angularImport(),
      loaders.json()
    ]
  },
  externals: {jquery: 'jQuery'},
  devtool: false,
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
}
