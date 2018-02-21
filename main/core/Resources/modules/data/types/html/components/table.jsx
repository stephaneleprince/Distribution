import React from 'react'
import {PropTypes as T, implementPropTypes} from '#/main/core/scaffolding/prop-types'
import {DataCell as DataCellTypes} from '#/main/core/data/prop-types'

import {getPlainText} from '#/main/core/data/types/html/utils'

//TODO: Change it to only return plain text once intra-plugin communication available
const HtmlCell = props => props.trust ?
  <span dangerouslySetInnerHTML={{__html: props.data}}/> :
  <span>{getPlainText(props.data)}</span>

implementPropTypes(HtmlCell, DataCellTypes, {
  trust: T.bool
})

export {
  HtmlCell
}
