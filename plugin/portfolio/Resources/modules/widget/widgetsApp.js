import WidgetController from './controllers/widgetController'
import WidgetDirective from './directives/widgetDirective'
import WidgetFactory from './services/widgetFactory'
import WidgetManager from './services/widgetManager'

import angular from 'angular'

var widgetsApp = angular.module('widgetsApp', ['ngResource', 'ngSanitize', 'ngAnimate', 'ui.tinymce',
  'ui.resourcePicker', 'ui.badgePicker', 'ui.datepicker', 'datetime', 'mgcrea.ngStrap.popover',
  'ui.bootstrap.collapse', 'app.translation', 'app.interpolator', 'app.directives', 'app.config'])

widgetsApp.config(['$httpProvider', function($http) {
  var elementToRemove = ['views', 'isCollapsed', 'isEditing', 'isUpdating', 'isDeleting', 'isNew']

  $http.defaults.transformRequest.push(function(data) {
    data = angular.fromJson(data)
    angular.forEach(data, function(element, index) {
      if(elementToRemove.inArray(index)) {
        delete data[index]
      }
    })
    return JSON.stringify(data)
  })
}])
widgetsApp.value('assetPath', window.assetPath)

widgetsApp.controller('widgetController', ['$scope', 'widgetManager', '$attrs', 'tinyMceConfig', WidgetController])
widgetsApp.directive('widgetContainer', WidgetDirective)
widgetsApp.factory('widgetFactory', ['$resource', 'urlInterpolator', WidgetFactory])
widgetsApp.factory('widgetManager', ['$http', '$q', 'widgetFactory', '$filter', WidgetManager])
