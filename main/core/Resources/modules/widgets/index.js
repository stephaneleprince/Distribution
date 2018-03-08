
function getWidget() {
  import(/* webpackChunkName: "simple-widget" */ '#/main/core/widgets/simple').then(module => {
    console.log(module)

  }).catch(error => 'An error occurred while loading the component')
}

export {
  getWidget
}
