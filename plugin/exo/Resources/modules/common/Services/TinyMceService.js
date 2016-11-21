import clarolineTinymce from '#/main/core/tinymce/tinymce'

function TinyMceService() {}

TinyMceService.prototype.getConfig = function getConfig() {
  var config = clarolineTinymce.getConfiguration()
  config.format = 'html'

  return config
}

export default TinyMceService
