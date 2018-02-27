import {t} from '#/main/core/translation'

import {UserCard} from '#/main/core/administration/user/user/components/user-card.jsx'

function getRoles(user) {
    return 'list of roles goes here'
}

const UserList = {
  open: {
    action: (row) => `#/users/form/${row.id}`
  },
  definition: [
    {
      name: 'username',
      type: 'username',
      label: t('username'),
      displayed: true,
      primary: true
    }, {
      name: 'lastName',
      type: 'string',
      label: t('last_name'),
      displayed: true
    }, {
      name: 'firstName',
      type: 'string',
      label: t('first_name'),
      displayed: true
    }, {
      name: 'email',
      alias: 'mail',
      type: 'email',
      label: t('email'),
      displayed: true
    }, {
      name: 'administrativeCode',
      type: 'string',
      label: t('code')
    }, {
      name: 'meta.lastLogin',
      type: 'date',
      alias: 'lastLogin',
      label: t('last_login'),
      displayed: true,
      options: {
        time: true
      }
    }, {
      name: 'roles',
      type: 'string',
      label: t('roles'),
      displayed: true,
      filterable: false,
      renderer: (rowData) => getRoles(rowData)
    }
  ],
  card: UserCard
}

export {
  UserList
}
