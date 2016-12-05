const path = require('path')
const paths = require('./paths')
const libraries = require('./libraries')

const externals = () => ({
  'jquery': 'jQuery',
  'claroline/resource-manager': 'ClarolineResourceManager',
  'claroline/tinymce': 'ClarolineTinymce'
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
