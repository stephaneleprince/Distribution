import BindHtmlDirective from './bindHtmlDirective'
import CollectionFormController from './collectionFormController'
import CollectionFormDirective from './collectionFormDirective'
import ConfirmClickDirective from './confirmClickDirective'
import LoadingFormDirective from './loadingFormDirective'
import ScrollContainerDirective from './scrollContainerDirective'

import angular from 'angular'

var appDirectives = angular.module('app.directives', [])

appDirectives
    .directive('scrollContainer', ['commentsManager', '$timeout', function (commentsManager, $timeout) {
      return {
        restrict: 'A',
        link: function ($scope, element) {
          $scope.comments = commentsManager.comments

          $scope.$watch('comments.length', function(newValue, oldValue) {
            if (newValue >= oldValue) {
              $timeout(function(){
                element[0].scrollTop = element[0].scrollHeight
              }, 0)
            }
          })
        }
      }
    }])

appDirectives.directive('bindHtml', ['$compile', BindHtmlDirective])
appDirectives.controller('collectionFormController', ['$scope', '$attrs', CollectionFormController])
appDirectives.directive('collectionForm', CollectionFormDirective)
appDirectives.directive('confirmClick', ['$parse', 'translationService', ConfirmClickDirective])
appDirectives.directive('loadingForm', ['$parse', ScrollContainerDirective])
appDirectives.directive('loadingForm', ['$parse', LoadingFormDirective])
