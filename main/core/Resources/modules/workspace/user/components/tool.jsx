import React from 'react'

import {trans} from '#/main/core/translation'
import {TabbedPageContainer} from '#/main/core/layout/tabs'
import {UserTab, UserTabActions} from '#/main/core/workspace/user/user/components/user-tab.jsx'
import {GroupTab, GroupTabActions} from '#/main/core/workspace/user/group/components/group-tab.jsx'
import {RoleTab, RoleTabActions} from '#/main/core/workspace/user/role/components/role-tab.jsx'
import {PendingTab, PendingTabActions} from '#/main/core/workspace/user/pending/components/pending-tab.jsx'

const Tool = () =>
  <TabbedPageContainer
    title={trans('workspace_management', {}, 'tools')}
    redirect={[
      {from: '/', exact: true, to: '/users'}
    ]}

    tabs={[
      {
        icon: 'fa fa-book',
        title: trans('users'),
        path: '/users',
        content: UserTab
      }/*,
      {
        icon: 'fa fa-book',
        title: trans('groups'),
        path: '/groups',
        actions: GroupTabActions,
        content: GroupTab
      },
      {
        icon: 'fa fa-book',
        title: trans('roles'),
        path: '/roles',
        actions: RoleTabActions,
        content: RoleTab
      },
      {
        icon: 'fa fa-book',
        title: trans('pending'),
        path: '/pending',
        actions: PendingTabActions,
        content: PendingTab
      }*/
    ]}
  />

export {
  Tool as UserTool
}
