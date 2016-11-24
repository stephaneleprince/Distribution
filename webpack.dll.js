const paths = require('./main/core/Resources/server/webpack/paths')
const plugins = require('./main/core/Resources/server/webpack/plugins')
const libraries = require('./main/core/Resources/server/webpack/libraries')
const loaders = require('./main/core/Resources/server/webpack/loaders')
const shared = require('./main/core/Resources/server/webpack/shared')

module.exports = {
  entry: libraries,
  output: {
    path: paths.output(),
    filename: '[name]-[hash].js',
    library: '[name]_[hash]'
  },
  resolve: {
    root: paths.bower()
  },
  plugins: [
    plugins.assetsInfoFile('webpack-dlls.json'),
    plugins.bowerFileLookup(),
    plugins.dlls()
  ],
  devtool: false,
  module: {
    loaders: [
    //these loaders are related to tinymce
      loaders.css(),
      loaders.font(),
      loaders.imageUris(),
      loaders.tinymceImport(),
      loaders.tinymceWrapper(),
      loaders.tinymceJquery()
    //add other loaders here
    ]
  },
  externals: shared.externals(),
}
