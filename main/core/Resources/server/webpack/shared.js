const path = require('path')
const paths = require('./paths')
const libraries = require('./libraries')
const entries = require('./entries')
const vendors = require('./vendors')

const externals = () => {
  //note that in vendor, the propertiy value if the path to the module 
  var libraries = vendors

  //required windows properties goes here
  libraries['jquery'] = 'jQuery'
  libraries['bundle-configs'] = 'BundlesConfiguration'
  libraries['angular-dragula'] = 'registerDragula'
  libraries['angular'] = 'angular'

  //here we add the "externals" part of the assets.json file.
  var packages = entries.collectPackages(paths.root())
  var webpackPackages = packages.filter(def => def.assets && def.assets.webpack)

  webpackPackages.forEach((package) => {
      var data = package.assets.webpack.externals
      if (data) {
          data.forEach(external => {
              libraries[external.module] = external.variable
          })
      }
  })

  console.error(libraries)

  return libraries
}

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
