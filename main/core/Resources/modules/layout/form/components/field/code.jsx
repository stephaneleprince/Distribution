import React, {Component} from 'react'
import classes from 'classnames'

import CodeMirror from 'codemirror'
import 'codemirror/addon/selection/active-line'

// for JSON code
import 'codemirror/mode/javascript/javascript'
import 'codemirror/addon/edit/matchbrackets'
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/addon/fold/foldgutter'
import 'codemirror/addon/fold/brace-fold'

/*import jsonlint from 'jsonlint/lib/jsonlint'
window.jsonlint = jsonlint
import 'codemirror/addon/lint/lint'
import 'codemirror/addon/lint/json-lint'*/

import {trans} from '#/main/core/translation'
import {PropTypes as T, implementPropTypes} from '#/main/core/scaffolding/prop-types'
import {FormField as FormFieldTypes} from '#/main/core/layout/form/prop-types'
import {TooltipButton} from '#/main/core/layout/button/components/tooltip-button.jsx'

class Code extends Component {
  constructor(props) {
    super(props)

    this.state = {
      minimal: true
    }
  }

  componentDidMount() {
    CodeMirror.fromTextArea(this.input, {
      mode: 'application/json',
      lineNumbers: true,
      //lineWrapping: true,
      gutters: [
        'CodeMirror-lint-markers',
        'CodeMirror-foldgutter',
      ],

      // addon : closebrackets
      autoCloseBrackets: true,

      // addon : matchbrackets
      matchBrackets: true,

      // addon : lint
      lint: true,

      // addon : active line
      styleActiveLine: true,

      // addon : foldcode
      foldGutter: true
    })
  }


  componentWillUnmount() {

  }

  render() {
    return (
      <div className={classes('editor-control code-control', {
        minimal: this.state.minimal
      })}>
        <TooltipButton
          id={`${this.props.id}-editor-toggle`}
          title={trans(this.state.minimal ? 'show_editor_toolbar' : 'hide_editor_toolbar')}
          position="left"
          className="toolbar-toggle"
          onClick={() => {
            this.setState({minimal: !this.state.minimal})
            this.props.onChangeMode({minimal: !this.state.minimal})
          }}
        >
          <span className={classes('fa', {
            'fa-plus-circle': this.state.minimal,
            'fa-minus-circle': !this.state.minimal
          })} />
        </TooltipButton>

        <textarea
          ref={input => this.input = input}
          id={this.props.id}
          className={classes('form-control', this.props.className)}
          value={this.props.value || ''}
          disabled={this.props.disabled}
          onChange={(e) => this.props.onChange(e.target.value.trim())}
        />
      </div>
    )
  }
}

implementPropTypes(Code, FormFieldTypes, {
  // more precise value type
  value: T.string,
  // custom props
  mode: T.string.isRequired,
  minRows: T.number
}, {
  value: '',
  minRows: 2
})

export {
  Code
}
