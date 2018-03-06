
const CORE_PLUGIN = 'CORE_PLUGIN'

const coreConfiguration = {
  widgets: [
    {
      name: 'profile',
      meta: {
        icon: 'fa fa-fw fa-user-circle-o',
        description: ''
      },
      context: ['desktop', 'workspace'],
      app: {
        entry: 'claroline-distribution-main-core-profile-widget',
        styles: 'claroline-distribution-main-core-profile-widget',
        translations: 'user'
      }
    }
  ]
}


export {
  CORE_PLUGIN,
  coreConfiguration
}
