/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/*global Routing*/

export default class UserHomeTabEditionModalCtrl {
  constructor($http, $uibModal, $uibModalInstance, ClarolineAPIService, homeTabId, callback) {
    this.$http = $http
    this.$uibModal = $uibModal
    this.$uibModalInstance = $uibModalInstance
    this.ClarolineAPIService = ClarolineAPIService
    this.homeTabId = homeTabId
    this.callback = callback
    this.homeTab = {}
  }

  submit() {
    let data = this.ClarolineAPIService.formSerialize('home_tab_form', this.homeTab)
    const route = Routing.generate(
      'api_put_user_home_tab_edition',
      {'_format': 'html', homeTab: this.homeTabId}
    )
    const headers = {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}

    this.$http.put(route, data, headers).then(
      d => {
        this.$uibModalInstance.close(d.data)
      },
      d => {
        if (d.status === 400) {
          this.$uibModalInstance.close()
          const instance = this.$uibModal.open({
            template: d.data,
            controller: 'UserHomeTabEditionModalCtrl',
            controllerAs: 'htfmc',
            bindToController: true,
            resolve: {
              homeTabId: () => { return this.homeTabId },
              callback: () => { return this.callback },
              homeTab: () => { return this.homeTab }
            }
          })

          instance.result.then(result => {
            if (!result) {
              return
            } else {
              this.callback(result)
            }
          })
        }
      }
    )
  }
}