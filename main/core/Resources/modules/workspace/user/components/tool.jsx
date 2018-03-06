import React from 'react'

import {trans} from '#/main/core/translation'
import {TabbedPageContainer} from '#/main/core/layout/tabs'
import {UserTab, UserTabActions} from '#/main/core/workspace/user/user/components/user-tab.jsx'
import {GroupTab, GroupTabActions} from '#/main/core/workspace/user/group/components/group-tab.jsx'
import {RoleTab, RoleTabActions} from '#/main/core/workspace/user/role/components/role-tab.jsx'
import {PendingTab} from '#/main/core/workspace/user/pending/components/pending-tab.jsx'

const Tool = () =>
  <TabbedPageContainer
    title={trans('workspace_management', {}, 'tools')}
    redirect={[
      {from: '/', exact: true, to: '/users'}
    ]}

    tabs={[
      {
        icon: 'fa fa-user',
        title: trans('users'),
        path: '/users',
        content: UserTab,
        //perm check here for creation
        actions: UserTabActions
      },
      {
        icon: 'fa fa-users',
        title: trans('groups'),
        path: '/groups',
        content: GroupTab,
        //perm check here for creation
        actions: GroupTabActions
      },
      {
        icon: 'fa fa-id-badge',
        title: trans('roles'),
        path: '/roles',
        content: RoleTab,
        actions: RoleTabActions
      },
      {
        icon: 'fa fa-book',
        title: trans('pending'),
        path: '/pendings',
        content: PendingTab
      }
    ]}
  />

export {
  Tool as UserTool
}
