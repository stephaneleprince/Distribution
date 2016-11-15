import angular from 'angular'
import Controller from './indexController'
import Directive from './indexDirective'

var indexApp = angular.module('indexApp', ['commentsApp', 'widgetsApp', 'statisticsApp'])
indexApp.controller('indexController', ['$scope', 'widgetManager', 'assetPath', Controller])
indexApp.directive('indexContainer', Directive)
