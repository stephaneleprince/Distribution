import angular from 'angular'
import clarolineTinymce from '#/main/core/tinymce/tinymce'

var appDirectives = angular.module('app.config', [])

var tinyMceConfig = clarolineTinymce.getConfiguration()
tinyMceConfig.format = 'text'

appDirectives.value('tinyMceConfig', tinyMceConfig)
