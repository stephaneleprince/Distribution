import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {actions as modalActions} from '#/main/core/layout/modal/actions'
import {MODAL_DELETE_CONFIRM} from '#/main/core/layout/modal'
import {TooltipAction} from '#/main/core/layout/button/components/tooltip-action'

import {MODAL_ADD_WIDGET} from '#/main/core/tools/home/editor/components/modal/add-widget'
import {MODAL_EDIT_WIDGET} from '#/main/core/tools/home/editor/components/modal/edit-widget'
import {Widget} from '#/main/core/tools/home/components/widget'
import {actions} from '#/main/core/tools/home/editor/actions'

const WidgetEditor = props =>
  <div className="widget-container">
    <div className="widget-actions text-right">
      <TooltipAction
        id={`add-before-${props.id}`}
        className="btn-link-default"
        icon="fa fa-fw fa-plus"
        label={trans('add_widget_before')}
        action={props.insert}
      />

      <TooltipAction
        id={`edit-${props.id}`}
        className="btn-link-default"
        icon="fa fa-fw fa-pencil"
        label={trans('edit')}
        action={() => props.edit(props.id)}
      />

      <TooltipAction
        id={`delete-${props.id}`}
        className="btn-link-danger"
        icon="fa fa-fw fa-trash-o"
        label={trans('delete')}
        action={() => props.delete(props.id)}
      />
    </div>

    <Widget
      id={props.id}
      title={props.title}
    />
  </div>

WidgetEditor.propTypes = {
  id: T.string.isRequired,
  title: T.string,
  insert: T.func.isRequired,
  edit: T.func.isRequired,
  delete: T.func.isRequired
}

const EditorComponent = props =>
  <div>
    <WidgetEditor
      id="id1"
      title="My widget title 1"
      insert={() => props.add(0)}
      edit={props.edit}
      delete={props.delete}
    />

    <WidgetEditor
      id="id2"
      title="My widget title 2"
      insert={() => props.add(1)}
      edit={props.edit}
      delete={props.delete}
    />

    <button
      className="btn btn-block btn-primary btn-add"
      onClick={props.add}
    >
      {trans('add_widget', {}, 'home')}
    </button>
  </div>

EditorComponent.propTypes = {
  widgets: T.arrayOf(T.shape({
    // widget
  })).isRequired,
  add: T.func.isRequired,
  edit: T.func.isRequired,
  delete: T.func.isRequired
}

const Editor = connect(
  state => ({

  }),
  dispatch => ({
    add(position) {
      dispatch(modalActions.showModal(MODAL_ADD_WIDGET, {
        selectType: (widgetType) => dispatch(actions.addWidget(widgetType, position))
      }))
    },
    edit() {
      dispatch(modalActions.showModal(MODAL_EDIT_WIDGET, {
        save: (widget) => true
      }))
    },
    delete(widgetId) {
      dispatch(modalActions.showModal(MODAL_DELETE_CONFIRM, {
        title: trans('widget_delete_confirm_title', {}, 'home'),
        question: trans('widget_delete_confirm_message', {}, 'home'),
        handleConfirm: () => dispatch(actions.removeWidget(widgetId))
      }))
    }
  })
)(EditorComponent)

export {
  Editor
}
