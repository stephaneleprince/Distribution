const paths = require('../../paths')
const entries = require('../../entries')
const fs = require('fs')
const validator = require('./validator')

function ConfigurationPlugin() {
}

ConfigurationPlugin.prototype.apply = function(compiler) {
  var generated = false
  compiler.plugin('emit', function(compilation, callback) {
    if (!generated) {
      console.log('\nGenerating claroline configuration file...')
      str = `module.exports = {${getConfigurations()}}`
      //fs.writeFileSync(paths.root() + '/web/dist/plugins-config.js', str)
      generated = true
      console.error(compilation.assets)
      compilation.assets['plugin-config']
      callback()
    }
  })
}

function getConfigurations() {
  const packages = entries.collectPackages(paths.root())
  var str = ''

  packages.forEach(el => {
    if (entries.isMetaPackage(el.path)) {
      str += getMetaEntries(el.path)
    } else {
      throw new Error('No implementation for client configuration file for the usual package.')
    }
  })

  return str
}

function getMetaEntries(targetDir) {
  var str = ''
  var requirements = []

  entries.getMetaBundles(targetDir).forEach(bundle => {
    var configFile = `${bundle}/Resources/config/config.js`
    if (fs.existsSync(configFile)) {
      var plugin = require(configFile)
      validator.validate(plugin)
      var mod = bundle.split('/').pop()
      requirements.push(`    ${mod}: require('${configFile}')`)
    }
  })

  return requirements.join(',\n')
}

module.exports = ConfigurationPlugin
