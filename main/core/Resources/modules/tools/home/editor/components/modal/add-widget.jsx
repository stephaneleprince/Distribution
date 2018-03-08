import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'
import flatten from 'lodash/flatten'
import uniq from 'lodash/uniq'

import {trans} from '#/main/core/translation'
import {BaseModal} from '#/main/core/layout/modal/components/base'

const MODAL_ADD_WIDGET = 'MODAL_ADD_WIDGET'

const WidgetPreview = props =>
  <li className="widget-preview">
    <h5 className="widget-title">{props.name}</h5>
  </li>

WidgetPreview.propTypes = {

}

const WidgetsGrid = props =>
  <ul className="modal-body widgets-preview">
    {props.widgets.map((widget, index) =>
      <WidgetPreview key={index} {...widget} />
    )}
  </ul>

WidgetsGrid.propTypes = {
  widgets: T.arrayOf(T.shape({

  })).isRequired
}

class AddWidgetModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      activeCategory: 'all',
      categories: [].concat(['all'], uniq(flatten(this.props.availableWidgets.map(widget => widget.categories)))),
      widgets: this.props.availableWidgets
    }

    this.filterTypes = this.filterTypes.bind(this)
  }

  filterTypes(category) {
    this.setState({
      activeCategory: category,
      widgets: 'all' === category ?
        this.props.availableWidgets :
        this.props.availableWidgets.filter(widget => widget.categories && -1 !== widget.categories.indexOf(category))
    })
  }

  render() {
    return (
      <BaseModal
        {...this.props}
        icon="fa fa-fw fa-plus"
        title={trans('add_widget', {}, 'home')}
        bsSize="lg"
      >
        <ul className="nav nav-tabs">
          {this.state.categories.map((category, index) =>
            <li key={index} className={classes({
              active: category === this.state.activeCategory})
            }>
              <a
                role="button"
                href=""
                onClick={(e) => {
                  e.preventDefault()
                  this.filterTypes(category)
                }}
              >
                {trans(category)}
              </a>
            </li>
          )}
        </ul>

        <WidgetsGrid
          widgets={this.state.widgets}
        />
      </BaseModal>
    )
  }
}

AddWidgetModal.propTypes = {
  availableWidgets: T.arrayOf(T.shape({
    // widget
  })).isRequired,
  add: T.func.isRequired
}

export {
  MODAL_ADD_WIDGET,
  AddWidgetModal
}
