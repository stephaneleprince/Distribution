import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'
import {DropdownButton, MenuItem} from 'react-bootstrap'

import {t} from '#/main/core/translation'
import {getPlainText} from '#/main/core/data/types/html/utils'
import {TooltipElement} from '#/main/core/layout/components/tooltip-element.jsx'
import {Checkbox} from '#/main/core/layout/form/components/field/checkbox.jsx'
import {DataListAction, DataCard, DataListProperty, DataListView} from '#/main/core/data/list/prop-types'
import {getBulkActions, getRowActions, getPropDefinition, getSortableProps, isRowSelected} from '#/main/core/data/list/utils'
import {ListActions, ListPrimaryAction, ListBulkActions} from '#/main/core/data/list/components/actions.jsx'

const DataGridItem = props =>
  <div className={classes('data-grid-item', props.data.className, {selected: props.selected})}>
    {props.onSelect &&
      <input
        type="checkbox"
        className="item-select"
        checked={props.selected}
        onChange={props.onSelect}
      />
    }

    <div className="item-header" style={{
      backgroundImage: 'url(' + props.data.poster + ')',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <span className="item-icon-container">
        {typeof props.data.icon === 'string' ?
          <span className={props.data.icon} />
         :
          props.data.icon
        }
      </span>

      {props.data.flags &&
        <div className="item-flags">
          {props.data.flags.map((flag, flagIndex) => flag &&
            <TooltipElement
              key={flagIndex}
              id={`item-${props.index}-flag-${flagIndex}`}
              tip={flag[1]}
            >
              <span className={classes('item-flag', flag[0])} />
            </TooltipElement>
          )}
        </div>
      }
    </div>

    <ListPrimaryAction
      item={props.row}
      action={props.primaryAction}
      className="item-content"
      disabledWrapper="div"
    >
      <h2 key="item-title" className="item-title">
        {props.data.title}
        {props.data.subtitle &&
          <small>{props.data.subtitle}</small>
        }
      </h2>

      {'sm' !== props.size && props.data.contentText &&
        <div key="item-description" className="item-description">
          {getPlainText(props.data.contentText)}
        </div>
      }

      {props.data.footer &&
        <div key="item-footer" className="item-footer">
          {'sm' !== props.size && props.data.footerLong ?
            props.data.footerLong : props.data.footer
          }
        </div>
      }
    </ListPrimaryAction>

    {props.actions &&
      <ListActions
        id={`data-grid-item-${props.index}-actions`}
        item={props.row}
        actions={props.actions}
      />
    }
  </div>

DataGridItem.propTypes = {
  index: T.number.isRequired,
  size: T.string.isRequired,
  row: T.object.isRequired,

  /**
   * Computed card data from row.
   */
  data: T.shape(
    DataCard.propTypes
  ).isRequired,

  primaryAction: T.shape({
    disabled: T.func,
    action: T.oneOfType([T.string, T.func]).isRequired
  }),

  actions: T.arrayOf(
    T.shape(DataListAction.propTypes)
  ),
  selected: T.bool,
  onSelect: T.func
}

DataGridItem.defaultProps = {
  selected: false
}

const DataGridSort = props =>
  <div className="data-grid-sort">
    {t('list_sort_by')}
    <DropdownButton
      id="data-grid-sort-menu"
      title={props.current.property && getPropDefinition(props.current.property, props.available) ?
        getPropDefinition(props.current.property, props.available).label :
        t('none')
      }
      bsStyle="link"
      noCaret={true}
      pullRight={true}
    >
      <MenuItem header>{t('list_columns')}</MenuItem>
      {props.available.map(column =>
        <MenuItem
          key={`sort-by-${column.name}`}
          onClick={() => props.updateSort(column.alias ? column.alias : column.name)}
        >
          {column.label}
        </MenuItem>
      )}
    </DropdownButton>

    <button
      type="button"
      className="btn btn-link"
      disabled={!props.current.property}
      onClick={() => !props.current.property && props.updateSort(props.current.property)}
    >
      <span className={classes('fa fa-fw', {
        'fa-sort'     :  0 === props.current.direction || !props.current.direction,
        'fa-sort-asc' :  1 === props.current.direction,
        'fa-sort-desc': -1 === props.current.direction
      })} />
    </button>
  </div>


DataGridSort.propTypes = {
  current: T.shape({
    property: T.string,
    direction: T.number
  }).isRequired,
  available: T.arrayOf(
    T.shape(DataListProperty.propTypes)
  ).isRequired,
  updateSort: T.func.isRequired
}

const DataGrid = props =>
  <div className={`data-grid data-grid-${props.size}`}>
    <div className="data-grid-header">
      {props.selection &&
        <Checkbox
          id="data-grid-select"
          label={t('list_select_all')}
          labelChecked={t('list_deselect_all')}
          checked={0 < props.selection.current.length}
          onChange={() => props.selection.toggleAll(props.data)}
        />
      }

      {1 < props.count && props.sorting &&
        <DataGridSort
          {...props.sorting}
          available={getSortableProps(props.columns)}
        />
      }
    </div>

    {props.selection && 0 < props.selection.current.length &&
      <ListBulkActions
        count={props.selection.current.length}
        selectedItems={props.selection.current.map(id => props.data.find(row => id === row.id) || {id: id})}
        actions={getBulkActions(props.actions)}
      />
    }

    <ul className="data-grid-content">
      {props.data.map((row, rowIndex) =>
        <li className="data-grid-item-container" key={`data-item-${rowIndex}`}>
          <DataGridItem
            index={rowIndex}
            size={props.size}
            row={row}
            data={props.card(row, props.size)}
            primaryAction={props.primaryAction}
            actions={getRowActions(props.actions)}
            selected={isRowSelected(row, props.selection ? props.selection.current : [])}
            onSelect={props.selection ? () => props.selection.toggle(row) : null}
          />
        </li>
      )}
    </ul>
  </div>

DataGrid.propTypes    = DataListView.propTypes
DataGrid.defaultProps = DataListView.defaultProps

export {
  DataGrid
}
