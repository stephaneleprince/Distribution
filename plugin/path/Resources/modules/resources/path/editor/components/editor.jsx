import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {select as formSelect} from '#/main/core/data/form/selectors'
import {actions as formActions} from '#/main/core/data/form/actions'
import {FormContainer} from '#/main/core/data/form/containers/form.jsx'

const EditorComponent = props =>
  <section className="resource-section">
    <h2 className="h-first">{trans('configuration', {}, 'platform')}</h2>
    <FormContainer
      level={3}
      name="pathForm"
      sections={[]}
    />
  </section>

EditorComponent.propTypes = {
  path: T.object,
  updateProp: T.func.isRequired
}

const Editor = connect(
  state => ({
    path: formSelect.data(formSelect.form(state, 'pathForm'))
  }),
  dispatch => ({
    updateProp(propName, propValue) {
      dispatch(formActions.updateProp('pathForm', propName, propValue))
    }
  })
)(EditorComponent)

export {
  Editor
}
