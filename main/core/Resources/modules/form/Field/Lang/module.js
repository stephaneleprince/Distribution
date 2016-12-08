import angular from 'angular'

import 'angular-ui-translation/angular-translation'
import LangDirective from './LangDirective'

angular.module('FieldLang', ['ui.translation']).directive('formLang', () => new LangDirective)
