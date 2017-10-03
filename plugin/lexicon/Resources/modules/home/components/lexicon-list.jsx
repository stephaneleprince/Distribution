/**
 * This file was copied and update from QuestionBank bundle
 */


import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import { DropdownButton, MenuItem } from 'react-bootstrap'
import {translex} from '#/main/core/translation'
import classes from 'classnames'


import {
  Table,
  TableRow,
  TableCell,
  TableTooltipCell,
  TableHeader,
  TableHeaderCell,
  TableSortingCell
} from '#/main/core/layout/table/components/table.jsx'



const SelectedRow = props =>
  <tr className="selected-rows active">
    <td className="text-left" >
      <span className="fa fa-fw fa-check-square" style={{marginLeft:30}}/>
    </td>
    <td
      className="text-left"
      colSpan={5}
      dangerouslySetInnerHTML={{ __html: translex('questions_selected', props.selected.length, {count: props.selected.length})}}
    >
    </td>
    <td className="table-actions text-right">
      <button
        role="button"
        className="btn btn-link"
        onClick={() => props.onShare(props.selected)}
      >
        <span className="fa fa-fw fa-share" />
        <span className="sr-only">{translex('questions_share')}</span>
      </button>
      <button
        role="button"
        className="btn btn-link btn-link-danger"
        onClick={() => props.onDelete(props.selected)}
      >
        <span className="fa fa-fw fa-trash-o" />
        <span className="sr-only">{translex('questions_delete')}</span>
      </button>
    </td>
  </tr>

SelectedRow.propTypes = {
  selected: T.arrayOf(T.string).isRequired,
  onDelete: T.func.isRequired,
  onShare: T.func.isRequired
}

const LexiconTableHeader = props =>
  <TableHeader>
    <tr>
      <TableHeaderCell align="center">
        <input type="checkbox" onChange={props.toggleSelectAll} />
      </TableHeaderCell>
      <TableSortingCell
        align="left"
        direction={'type' === props.sortBy.property ? props.sortBy.direction : 0}
        onSort={() => props.onSort('type')}
      >
        {translex('type')}
      </TableSortingCell>
      <TableSortingCell
        direction={'content' === props.sortBy.property ? props.sortBy.direction : 0}
        onSort={() => props.onSort('content')}
      >
        {translex('resources_title')}
      </TableSortingCell>
      <TableSortingCell
        direction={'category' === props.sortBy.property ? props.sortBy.direction : 0}
        onSort={() => props.onSort('category')}
      >
        {translex('state_resources')}
      </TableSortingCell>
      <TableSortingCell
        align="left"
        direction={'updated' === props.sortBy.property ? props.sortBy.direction : 0}
        onSort={() => props.onSort('updated')}
      >
        {translex('last_modified')}
      </TableSortingCell>
      <TableSortingCell
        direction={'author' === props.sortBy.property ? props.sortBy.direction : 0}
        onSort={() => props.onSort('author')}
      >
        {translex('creator')}
      </TableSortingCell>
      <TableHeaderCell align="right">&nbsp;</TableHeaderCell>
    </tr>
      {0 < props.selected.length &&
        <SelectedRow
          selected={props.selected}
          onDelete={props.onDelete}
          onShare={props.onShare}
        /> 
      }
  </TableHeader>

LexiconTableHeader.propTypes = {
  selected: T.array.isRequired,
  sortBy: T.shape({
    property: T.string,
    direction: T.number
  }),
  toggleSelectAll: T.func.isRequired,
  onSort: T.func.isRequired,
  onShare: T.func.isRequired,
  onDelete: T.func.isRequired
}


function glossaryCliked(type, dict, lang, author) {
  return window.location.assign(origin="/app_dev.php/lexicon/content/"+type+"/"+dict+"/"+lang+"/"+author);
}

function formatDate(date) {
  console.log(date)
  const partdate = date.split('T')
  const day = partdate[0]
  const hour = partdate[1].split('+')[0]
  const partday = day.split('-')
  const result = 'Le  '+partday[2]+'-'+partday[1]+'-'+partday[0]+'  à '+hour
  return result
 }

const StatusDict = props => 
    <span>
        {props.question.userClaro == props.question.meta.authors[0].name ? 
          (<span className="fa fa-eye text-primary" style={{marginRight:25, 'cursor':'pointer'}} />) :
          (<span className="fa fa-eye text-primary" style={{marginRight:25}} />)
        }
        {props.question.userClaro == props.question.meta.authors[0].name ? 
          (<span className="fa fa-pencil text-primary" style={{marginRight:25, 'cursor':'pointer'}} />) :
          (<span className="fa fa-pencil text-primary" style={{marginRight:25}} />)
        }
        {props.question.userClaro == props.question.meta.authors[0].name ?
          (<span className='fa fa-trash-o text-danger' style={{marginRight:25, 'cursor':'pointer'}} />) :
          (<span className='fa fa-trash-o text-default' style={{marginRight:25, 'cursor':'not-allowed'}} />)
        }
        {props.question.userClaro == props.question.meta.authors[0].name ?
          (<span className="fa fa-comments-o text-primary" style={{marginRight:1, 'cursor':'pointer'}} />) :
          (<span className="fa fa-comments-o text-primary" style={{marginRight:1}} />)
        }
    </span>


const LexiconRow = props =>
  <TableRow className={props.isSelected ? 'selected' : null}>
    {props.question.userClaro == props.question.meta.authors[0].name ? 
        (<TableCell align="center" className="bg-primary"> 
             <input type="checkbox" onChange={() => props.toggleSelect(props.question)} />
           
         </TableCell>) :
        (<TableCell align="center"> 
             <input type="checkbox" onChange={() => props.toggleSelect(props.question)} />
         </TableCell>)
    }
    <TableCell align="left" className=""> 
      <small className="text-muted" style={{marginLeft:1}}> {props.question.type}</small>
    </TableCell>
    <TableCell>
      <span style={{'cursor':'pointer'}} onClick={() => glossaryCliked(props.question.type, props.question.id, props.question.lang, props.question.meta.authors[0].name)}>
        {props.question.title || props.question.content}
      </span>
    </TableCell>
    <TableCell>
      <StatusDict question={props.question}/>
    </TableCell>
    <TableCell align="left">
      {props.question.meta.updated ?
          <small className="text-muted">{formatDate(props.question.meta.updated)}</small> : '-'
      }
    </TableCell>
    <TableCell>
      {props.question.meta.authors ?
        <small className="text-muted">
          {props.question.meta.authors[0].name}
        </small> : '-'
      }
    </TableCell>
    <TableCell align="right" className="table-actions">
      <DropdownButton
        id={`dropdown-other-actions-${props.question.id}`}
        title={<span className="fa fa-fw fa-ellipsis-v" />}
        bsStyle="link"
        noCaret={true}
        pullRight={true}
      >
        <MenuItem header>Actions</MenuItem>
        <MenuItem
          onClick={() => props.onShare([props.question.id])}
        >
          <span className="fa fa-fw fa-share" />&nbsp;
          {translex('question_share')}
        </MenuItem>
        {props.question.userClaro == props.question.meta.authors[0].name ? 
          (<MenuItem divider ></MenuItem>) : (<span></span>)
        }
        {props.question.userClaro == props.question.meta.authors[0].name ?  
            (<MenuItem
              className="dropdown-link-danger"
              onClick={() => props.onDelete([props.question.id, props.question.lang])}
              >
              <span className="fa fa-fw fa-trash-o" />&nbsp;
              {translex('question_delete')}
            </MenuItem>) : 
            (<span></span>)
        }
      </DropdownButton>
    </TableCell>
  </TableRow>

LexiconRow.propTypes = {
  question: T.shape({
    id: T.string,
    type: T.string.isRequired,
    title: T.string,
    content: T.string.isRequired,
    meta: T.shape({
      updated: T.string,
      category: T.shape({
        name: T.string
      }),
      authors: T.arrayOf(T.shape({
        name: T.isRequired
      })),
      sharedWith: T.array.isRequired,
      usedBy: T.array.isRequired
    }).isRequired
  }).isRequired,
  isSelected: T.bool,
  toggleSelect: T.func.isRequired,
  onShare: T.func.isRequired,
  onDelete: T.func.isRequired
}

LexiconRow.defaultProps = {
  isSelected: false
}

function goContent(id) {
  return window.location.assign(url: "lexicon/home");
}


export default class LexiconList extends Component {

  render() {

    return(
      <Table
        isEmpty={0 === this.props.lexiconsResources.length}
      >
        <LexiconTableHeader
          selected={this.props.selected}
          toggleSelectAll={this.props.toggleSelectAll}
          sortBy={this.props.sortBy}
          onSort={this.props.onSort}
          onShare={(items) => this.props.onShare(items)}
          onDelete={this.props.onDelete}
        />

        <tbody>
        {this.props.lexiconsResources.map(question => (
          <LexiconRow
            key={question.id}
            question={question}
            isSelected={-1 !== this.props.selected.indexOf(question.id)}
            onShare={(items) => this.props.onShare(items)}
            onDelete={this.props.onDelete}
            toggleSelect={this.props.toggleSelect}
          />
        ))}
        </tbody>
      </Table>
    )
  }
}

LexiconList.propTypes = {
  lexiconsResources: T.array.isRequired,
  selected: T.array.isRequired,
  sortBy: T.object.isRequired,
  onSort: T.func.isRequired,
  onDelete: T.func.isRequired,
  onShare: T.func.isRequired,
  toggleSelect: T.func.isRequired,
  toggleSelectPage: T.func.isRequired,
  toggleSelectAll: T.func.isRequired
}
