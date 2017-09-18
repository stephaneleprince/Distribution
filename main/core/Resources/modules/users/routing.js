import usersMainTemplate from './Partial/main.html'
import groupsMainTemplate from './../groups/Partial/main.html'
import usersContentTemplate from './Partial/user_content.html'
import mergeTemplate from './Partial/users_merge.html'

export default function ($stateProvider, $urlRouterProvider) {
  const translate = function (key) {
    return window.Translator.trans(key, {}, 'platform')
  }

  $stateProvider
    .state('users', {
      abstract: true,
      url: '/users',
      template: usersMainTemplate,
      controller: 'UserController',
      controllerAs: 'uc'
    })
    .state('users.list', {
      url: '',
      ncyBreadcrumb: {
        label: translate('user_list')
      },
      views: {
        'users': {
          template: usersContentTemplate
        }
      }
    })
    .state('users.groups', {
      abstract: true,
      url: '/groups',
      ncyBreadcrumb: {
        label: translate('group_list'),
        parent: 'users.list'
      },
      views: {
        'groups': {
          template: groupsMainTemplate
        }
      }
    })
    .state('users.merge', {
      url: '/merge',
      ncyBreadcrumb: {
        label: translate('merge_users'),
        parent: 'users.list'
      },
      views: {
        'merge': {
          template: mergeTemplate
        }
      }
    })

  $urlRouterProvider.otherwise('/users')
}
