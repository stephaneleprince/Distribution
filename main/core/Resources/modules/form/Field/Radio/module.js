import angular from 'angular'

import 'angular-ui-translation/angular-translation'
import RadioDirective from './RadioDirective'

angular.module('FieldRadio', ['ui.translation']).directive('formRadio', () => new RadioDirective)
