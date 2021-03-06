import cloneDeep from 'lodash/cloneDeep'
import extend from 'lodash/extend'
import isNil from 'lodash/isNil'
import isUndefined from 'lodash/isUndefined'
import map from 'lodash/map'

export default class ResourceIconItemService {
  constructor(iconSet, iconItemsByType, $http, $q, $filter, Upload) {
    this._http = $http
    this._q = $q
    this._filter = $filter
    this._Upload = Upload
    this.iconSet = iconSet
    this.icons = this._initializeIcons(iconItemsByType)
  }

  getIconSet() {
    return this._resolve(this.iconSet)
  }

  getIcons() {
    return this._resolve(this.icons)
  }

  uploadNewIcon(iconItem, file) {
    if (file) {
      return this._Upload.upload({
        'url': this._path('claro_admin_resource_icon_set_upload_new_icon', {'id': this.iconSet.id, 'filename': iconItem.filename}),
        'data': {file: file}
      }).then(
        response =>{
          let data = response.data
          if (!isNil(data) && !isNil(data.relative_url)) {
            iconItem.default = false
            iconItem.relative_url = data.relative_url+'?'+Date.now()
          }
          return this._resolve(iconItem)
        }, response => {
          return this._reject(response.data)
        }
      )
    }
    return this._resolve(null)
  }

  remove(iconItem) {
    if(!iconItem.default) {
      return this._request('DELETE', this._path('claro_admin_resource_icon_set_item_delete', {'id': this.iconSet.id, 'filename': iconItem.filename})).then(
        data => {
          if (!isNil(data.relative_url)) {
            iconItem.default = true
            iconItem.relative_url = data.relative_url
          }
          return this._resolve(iconItem)
        },
        data => {
          return this._reject(data)
        }
      )
    } else {
      return this._resolve(iconItem)
    }
  }

  _initializeIcons(iconItemsByType)
  {
    // In case of new set
    if (this.iconSet === null || isUndefined(iconItemsByType.set_icons) || isUndefined(iconItemsByType.default_icons)) {
      let resourceIcons = map(cloneDeep(iconItemsByType.resource_icons), icon => extend(icon, {default: false}))
      let fileIcons = map(cloneDeep(iconItemsByType.file_icons), icon => extend(icon, {default: false}))

      return {'resources': resourceIcons, 'files': fileIcons}
    }
    // In case of existing set
    let resourceIcons = map(cloneDeep(iconItemsByType.set_icons.resource_icons), icon => extend(icon, {default: false}))
      .concat(map(cloneDeep(iconItemsByType.default_icons.resource_icons), icon => extend(icon, {default:true})))
    let fileIcons = map(cloneDeep(iconItemsByType.set_icons.file_icons), icon => extend(icon, {default: false}))
      .concat(map(cloneDeep(iconItemsByType.default_icons.file_icons), icon => extend(icon, {default:true})))

    return {'resources': resourceIcons, 'files': fileIcons}
  }

  _path(name, params = {}) {
    return this._filter('path')(name, params)
  }

  _request(method, path, data = null, config = {}) {
    return this._http({method: method, url: path, data: data, config: config}).then(
      response => {
        if (typeof response.data === 'object') {
          return this._resolve(response.data)
        } else {
          return this._reject(response.data)
        }
      },
      response => {
        return this._reject(response.data)
      }
    )
  }

  _reject(data) {
    return this._q.reject(data)
  }

  _resolve(data) {
    return this._q.resolve(data)
  }
}
ResourceIconItemService.$inject = ['iconSet', 'iconItemsByTypes', '$http', '$q', '$filter', 'Upload']