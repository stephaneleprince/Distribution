import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import merge from 'lodash/merge'
import set from 'lodash/set'

import {trans}     from '#/main/core/translation'
import {BaseModal} from '#/main/core/layout/modal/components/base.jsx'
import {DataFormModal} from '#/main/core/data/form/modals/components/data-form.jsx'

import {t_res}     from '#/main/core/resource/translation'
import {constants} from '#/main/core/resource/constants'

const MODAL_RESOURCE_PROPERTIES = 'MODAL_RESOURCE_PROPERTIES'

class EditPropertiesModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      resourceNode: props.resourceNode ? props.resourceNode : {}
    }

    this.updateProp = this.updateProp.bind(this)
  }

  /**
   * We locally manage a copy of current node to be able
   * to manage fields conditionality.
   *
   * @param {string} propName
   * @param {*}      propValue
   */
  updateProp(propName, propValue) {
    const newNode = merge({}, this.state.resourceNode)

    set(newNode, propName, propValue)

    this.setState({
      resourceNode: newNode
    })
  }

  render() {
    return (
      <DataFormModal
        {...this.props}
        title={t_res('edit-properties')}
        data={this.props.resourceNode}
        save={this.props.save}
        fadeModal={this.props.fadeModal}
        sections={[
          {
            id: 'general',
            title: trans('general'),
            primary: true,
            fields: [
              {
                name: 'name',
                label: t_res('resource_name'),
                type: 'string',
                required: true
              }
            ]
          }, {
            id: 'meta',
            icon: 'fa fa-fw fa-info',
            title: t_res('resource_meta'),
            fields: [
              {
                name: 'meta.description',
                label: t_res('resource_description'),
                type: 'html'
              }, {
                name: 'meta.published',
                label: t_res('resource_not_published'),
                type: 'boolean',
                options: {
                  labelChecked: t_res('resource_published')
                }
              }, {
                name: 'meta.portal',
                label: t_res('resource_portal_not_published'),
                type: 'boolean',
                options: {
                  labelChecked: t_res('resource_portal_published')
                }
              }
            ]
          }, {
            id: 'display',
            icon: 'fa fa-fw fa-desktop',
            title: trans('display_parameters'),
            fields: [
              {
                name: 'poster',
                label: trans('poster'),
                type: 'image',
                options: {
                  ratio: '3:1'
                }
              }, {
                name: 'display.fullscreen',
                label: t_res('resource_fullscreen'),
                type: 'boolean'
              }, {
                name: 'display.closable',
                label: t_res('resource_closable'),
                type: 'boolean'
              }, {
                name: 'display.closeTarget',
                label: t_res('resource_close_target'),
                type: 'enum',
                required: true,
                options: {
                  noEmpty: true,
                  choices: constants.RESOURCE_CLOSE_TARGETS
                }
              }
            ]
          }, {
            id: 'restrictions',
            icon: 'fa fa-fw fa-key',
            title: trans('access_restrictions'),
            fields: [
              {
                name: 'restrictions.enableDates',
                label: trans('restrict_by_dates'),
                type: 'boolean',
                calculated: this.props.resourceNode.restrictions && 0 !== this.props.resourceNode.restrictions.dates.length,
                onChange: activated => {
                  if (!activated) {
                    this.updateProp('restrictions.dates', [])
                  } else {
                    this.updateProp('restrictions.dates', [null, null])
                  }
                },
                linked: [
                  {
                    name: 'restrictions.dates',
                    type: 'date-range',
                    label: trans('access_dates'),
                    displayed: this.props.resourceNode.restrictions && 0!== this.props.resourceNode.restrictions.dates.length,
                    required: true,
                    options: {
                      time: true
                    }
                  }
                ]
              }, {
                name: 'meta.accesses.code',
                label: t_res('resource_access_code'),
                type: 'boolean',
                onChange: activated => {
                  if (!activated) {
                    this.updateProp('meta.accesses.code', null)
                  }
                },
                linked: [
                  {
                    name: 'props.meta.accesses.code',
                    label: trans('access_code'),
                    type: 'password',
                    required: true
                  }
                ]
              }, {
                name: 'meta.accesses.ip.activateFilters',
                label: t_res('resource_access_ips'),
                type: 'boolean',
                onChange: activated => {
                  if (!activated) {
                    this.updateProp('meta.accesses.ip.ips', [])
                  }
                },
                linked: [
                  {
                    name: 'props.meta.accesses.ip.ips',
                    label: trans('resource_allowed_ip'),
                    type: 'ip',
                    required: true,
                    options: {
                      placeholder: t_res('resource_no_allowed_ip'),
                      multiple: true
                    }
                  }
                ]
              }
            ]
          }, {
            id: 'license',
            icon: 'fa fa-fw fa-copyright',
            title: t_res('resource_authors_license'),
            fields: [
              {
                name: 'meta.authors',
                label: t_res('resource_authors'),
                type: 'string'
              }, {
                name: 'meta.license',
                label: t_res('resource_license'),
                type: 'string'
              }
            ]
          }
        ]}
      />
    )
  }
}

EditPropertiesModal.propTypes = {
  resourceNode: T.object,
  fadeModal: T.func.isRequired,
  save: T.func.isRequired
}

export {
  MODAL_RESOURCE_PROPERTIES,
  EditPropertiesModal
}
