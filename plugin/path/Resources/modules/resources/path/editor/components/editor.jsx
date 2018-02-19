import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {select as formSelect} from '#/main/core/data/form/selectors'
import {actions as formActions} from '#/main/core/data/form/actions'
import {FormContainer} from '#/main/core/data/form/containers/form.jsx'

import {actions} from '#/plugin/path/resources/path/editor/actions'

const Summary = props =>
  <aside className="summary-container opened">
    <header className="summary-header">
      <h2 className="summary-title">
        <span className="fa fa-fw fa-ellipsis-v"/>
        {trans('summary', {}, 'path_wizards')}
      </h2>
      <div className="summary-controls">
        <button
          type="button"
          className="summary-control summary-control-pin btn btn-link"
        >
          <span className="fa fa-fw fa-map-pin"/>
        </button>
        <button
          type="button"
          className="summary-control btn btn-link"
        >
          <span className="fa fa-fw fa-chevron-left"/>
        </button>
      </div>
    </header>
    <nav className="path-summary-tree">
      <ul className="tree">
        <li className="summary-link">
          <div className="tree-item">
            <div className="step">
              <span className="step-progression fa fa-fw fa-circle"/>
              <span className="step-name">
                {trans('parameters', {}, 'platform')}
              </span>
            </div>
          </div>
        </li>
      </ul>
      <button
        className="btn btn-primary"
        onClick={() => props.addStep(null)}
      >
        {trans('step_add_child', {}, 'path_wizards')}
      </button>
    </nav>
  </aside>

const EditorComponent = props =>
  <section className="resource-section">
    <h2 className="h-first">{trans('configuration', {}, 'platform')}</h2>
    <Summary {...props}/>
    <FormContainer
      level={3}
      name="pathForm"
      sections={[]}
    />
  </section>

EditorComponent.propTypes = {
  path: T.object,
  addStep: T.func.isRequired,
  removeStep: T.func.isRequired,
  updateProp: T.func.isRequired
}

const Editor = connect(
  state => ({
    path: formSelect.data(formSelect.form(state, 'pathForm'))
  }),
  dispatch => ({
    addStep(parentId) {
      dispatch(actions.addStep(parentId))
    },
    removeStep(id) {
      dispatch(actions.removeStep(id))
    },
    updateProp(propName, propValue) {
      dispatch(formActions.updateProp('pathForm', propName, propValue))
    }
  })
)(EditorComponent)

export {
  Editor
}
