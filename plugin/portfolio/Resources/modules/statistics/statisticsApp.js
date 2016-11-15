import angular from 'angular'

import Directive from './directives/statisticsViewDirective'
import Controller from './controllers/statisticsViewController'

var statisticsApp = angular.module('statisticsApp', ['angular-toArrayFilter', 'daterangepicker'])

statisticsApp.controller('statisticsViewController', ['$scope', 'portfolioManager', '$filter', '$http', 'urlInterpolator', 'translationService', Controller])
statisticsApp.directive('statisticsViewContainer', Directive)
