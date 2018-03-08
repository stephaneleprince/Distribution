
const CORE_PLUGIN = 'CORE_PLUGIN'

const coreConfiguration = {
  actions: [],
  resources: [],
  tools: [],
  widgets: [
    {
      name: 'simple',
      meta: {
        icon: 'fa fa-fw fa-pencil',
        description: ''
      },
      context: ['desktop', 'workspace'],
      app: '#/main/core/widgets/simple',
      styles: 'claroline-distribution-main-core-profile-widget'
    }, {
      name: 'profile',
      meta: {
        icon: 'fa fa-fw fa-user-circle-o',
        description: ''
      },
      context: ['desktop', 'workspace']
    }, {
      name: 'list',
      meta: {
        icon: 'fa fa-fw fa-user-circle-o',
        description: ''
      }
    }
  ]
}

export {
  CORE_PLUGIN,
  coreConfiguration
}
