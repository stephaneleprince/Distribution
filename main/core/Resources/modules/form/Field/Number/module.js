import angular from 'angular'

import 'angular-ui-translation/angular-translation'
import NumberDirective from './NumberDirective'

angular.module('FieldNumber', ['ui.translation']).directive('formNumber', () => new NumberDirective)
