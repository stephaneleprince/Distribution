import angular from 'angular'

import 'angular-ui-translation/angular-translation'
import HelpBlockDirective from './HelpBlockDirective'

angular.module('HelpBlock', ['ui.translation'])
  .directive('helpBlock', ['$parse', '$compile', ($parse, $compile) => new HelpBlockDirective($parse, $compile)])
