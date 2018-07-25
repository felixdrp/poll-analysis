// @flow
import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import styles from './Table.css';
import reactStringReplace from 'react-string-replace'
// import {forEach, interval, take, fromIter, map, filter, pipe, subscribe} from 'callbag-basics'
import timer from 'timer-total'
import TableHeader from './TableHeader';

export default class TableScrollPage extends Component<Props> {
  props: Props;

  constructor() {
    super()
    this.state = {
      page: 1,
      sortOptions: {
        key: 'Object.keys',
        direction: 'asc',
        insensitive: true
        // (k)=>k.freq,'desc',true
      },
      rowBlueprint: []
    }
    this.pageTotal = 0
    this.ticking = false
  }

  // Component need to know DOM box size in order to calc number of pages.
  componentDidMount() {
    this.setTablePageState()
  }

  static getDerivedStateFromProps(props, state) {
    if (!props.data || !state.data) {
      return null;
    }

    let propsLength, stateLength
    let dataIndex = generateIndex(props.data)

    // Object or Array?
    if (props.data.constructor.name === 'Object') {
      propsLength = Object.keys(props.data).length
      stateLength = Object.keys(state.data).length
    } else {
      propsLength = props.data.length
      stateLength = state.data.length
    }

    if (propsLength !== stateLength) {
      return {
        ...state,
        pageTotal: Math.ceil(propsLength / state.rowsPerPage),
        data: props.data,
        dataIndex: props.data
          ? dataIndex.sort(sorting(state.sortOptions, props.data))
          : [],
        columnsActive: props.columns
          ? extractActiveheaders(props.columns)
          : [],
        rowBlueprint: props.columns
          ? extractRowBlueprint(props.columns)
          : [],
      };
    }

    // No state update necessary
    return null;
  }

  setTablePageState() {
    let table = this.table
    let rowBlueprint = extractRowBlueprint(this.props.columns)
    // The header's part that represent column data.
    let columnsActive = extractActiveheaders(this.props.columns)

    let dataIndex = generateIndex(this.props.data)

    this.rowHeight = table.scrollHeight / table.childElementCount
    this.rowsPerPage = Math.round(table.clientHeight / this.rowHeight)
    this.pageTotal = Math.ceil(table.childElementCount / this.rowsPerPage)
    // debugger
    // If table has elements assign default page number to inputPageNumber
    if (table.childElementCount > 0) {
      this.inputPageNumber.value = 1
    }

    this.setState((state, props) => {
      return {
        page: 1,
        rowHeight: this.rowHeight,
        rowsPerPage: this.rowsPerPage,
        pageTotal: this.pageTotal,
        data: props.data? props.data: [],
        dataIndex: props.data
          ? dataIndex.sort(sorting(state.sortOptions, props.data))
          : [],
        rowBlueprint,
        columnsActive,
        selectedColumn: props.columns[0].header,
      }
    })
  }

  setOrderBy(selection) {
    this.setState((state, props) => {
      let dataIndex = generateIndex(props.data)
      const sortOptions = {
        ...state.sortOptions,
        ...selection
      }

      return {
        sortOptions,
        dataIndex: props.data
          ? dataIndex.sort(sorting(sortOptions, state.data))
          : []
      }
    })
  }

  scroll(event) {
    // console.log(this.table.scrollTop)
    this.scrollTop = this.table.scrollTop
    window.requestAnimationFrame(() => {
      this.inputPageNumber.value = Math.floor(
        this.table.scrollTop / (this.rowsPerPage * this.rowHeight)) + 1
    });
  }

  goToPage(pageNumber) {
    if (!pageNumber) {
      return
    }
    if (pageNumber > 0 && pageNumber <= this.pageTotal) {
      this.table.scrollTop = (pageNumber - 1) * this.rowHeight * this.rowsPerPage
      this.inputPageNumber.value = pageNumber
    }
  }

  move({row = 0, page = 0}) {
    if (!row && !page) {
      return
    }
    let top = this.table.scrollTop
    let move = top + this.rowHeight * (row + (page * this.rowsPerPage))
    if (move < 0) {
      this.table.scrollTop = 0
      return
    }
    if (move > this.table.scrollHeight - this.rowsPerPage * this.rowHeight) {
      this.goToPage(this.pageTotal)
      return
    }
    this.table.scrollTop = move
  }

  setMoveTimer(value) {
    const options = {
      delay:300,
      interval: 100,
      callback: () => this.move(value)
    }
    return timer(options)
  }

  // Change selected columns
  selectColumn = (column, e) => {
    if (this.state.selectedColumn && this.state.selectedColumn == column) {
      return
    }
    this.setState({selectedColumn: column})
  }

  // Change hovered columns
  hoverColumn = (column, e) => {
    if (this.state.hoveringColumn && this.state.hoveringColumn == column) {
      return
    }
    this.setState({hoveringColumn: column})
  }

  render() {
    const stInput = {
      width: '70px',
      textAlign: 'center',
      border: '1px solid rgba(0,0,0,0.1)',
      background: '#fff',
      padding: '5px 7px',
      fontSize: 'inherit',
      borderRadius: '3px',
      fontWeight: 'normal',
      outline: 'none'
    }

    const {
      columns,
      clickEvent,
      onClick,
      phraseId,
      rowID,
      columnID,
      phrase,
      wordsSelected,
      expandText,
      columnHighlight,
    } = this.props;

    const {
      pageTotal,
    } = this.state;

    const expandTextLine = expandText == true || expandText == undefined
      ? true
      : false;
    const columnsActive = this.state.columnsActive
    // const columnsActive = this.extractActiveheaders(this.props.columns)

    const data = this.state.data || this.props.data
    let dataIndex = this.state.dataIndex || generateIndex(data)

    // let _styles = styles
    // let _reactStringReplace = reactStringReplace
    // if (data) {
    //   dataIndex = Object.keys(data)
    //   // debugger
    //   // dataIndex.sort(this.sorting('Object.keys','desc',true,data))
    //   dataIndex.sort(this.sorting(this.state.sortOptions))
    //   // forEach
    //   // interval
    //   // fromIter
    //   // map
    //   // filter
    //   // let source = interval(10)
    //   // let pipper = pipe(
    //   //   interval(1000),
    //   //   map(x => x + 1),
    //   //   filter(x => x % 2),
    //   //   take(5),
    //   //   forEach(x => console.log(x))
    //   // );
    //   // console.log(pipe)
    //   // console.log(pipper)
    //
    //   // debugger
    // }

    return (
      <div
        className={styles.table}
      >
        <TableHeader
          columns={columns}
          sortBy={this.setOrderBy.bind(this)}
          selectedColumn={this.state.selectedColumn}
          selectColumn={this.selectColumn}
          hoveringColumn={this.state.hoveringColumn}
          hoverColumn={this.hoverColumn}
          columnHighlight={columnHighlight}
        />

        <div
          style={{
            ...this.props.style,
            ...{
              // width: 250,
              // height: 200,
              overflowY: 'scroll',
              color: '#333',
              marginBottom: 4
            }
          }}
          onScroll={(e) => this.scroll(e)}
          ref={(table) => { this.table = table; }}
        >
          {/* Rows */}
          {dataIndex.map((row,i) => (
            <div
              key={i}
              onClick={clickEvent}
              data-id={row}
              className={styles['rt-tr']}
            >
              <span className={[styles.tableLine].join(' ')}>
              {
                data[row]
                  ? this.state.rowBlueprint.map((column, i) => {
                      let value = column == "Object.keys"
                        ? row
                        : column(data[row])
                      if (columnsActive[i].type == 'text') {
                        if (expandTextLine) {
                          value = value.substring(0, 20) + '...'
                        }
                      }
                      if (value.length == 0) {
                        value = '[Empty]'
                      }
                      // debugger
                      return (
                        <span
                          key={i}
                          className={
                            [
                              !columnHighlight &&
                              this.state.hoveringColumn &&
                              this.state.hoveringColumn == columnsActive[i].header
                                ? styles['ct-table-colum-hover']
                                : '',
                              this.state.selectedColumn &&
                              this.state.selectedColumn == columnsActive[i].header
                                ? styles['ct-table-header-colum-selected']
                                : '',
                              styles['rt-td'],
                            ].join(' ')
                          }
                          onMouseOver={(e)=>this.hoverColumn(columnsActive[i].header)}
                          onMouseOut={(e)=>this.hoverColumn('', e)}
                        >
                          {value}
                        </span>)
                    })
                  // columns["0"].columns[1].accessor(data[row])
                  : ''
              }
              </span>
              {
                // Add page mark
                (i % this.rowsPerPage) == 0
                ?
                  (
                    <span
                      style={{
                        float: 'right',
                        cursor: 'pointer',
                        marginRight: 1
                      }}
                      title={'Page ' + ((i / this.rowsPerPage) + 1) }
                      onClick={() => this.goToPage((i / this.rowsPerPage) + 1)}
                    >
                      [{(i / this.rowsPerPage) + 1}]
                    </span>
                  )
                  : ''
              }
              {
                // Adding text columns under the line

                expandTextLine && data[row]
                  ? this.state.rowBlueprint.map((column, i) => {
                      let value = column == "Object.keys"
                        ? row
                        : column(data[row])
                      if (value.length > 1) {
                        return (
                          <div
                            key={i}
                            style={{
                              borderLeftColor: 'rgba(0,0,0,0)',
                              borderLeftStyle: 'solid',
                              borderLeftWidth: 30,
                              // margin: 3,
                              // padding: 4,
                            }}
                          >
                            <div
                              className={
                                [
                                  this.state.hoveringColumn &&
                                  this.state.hoveringColumn == columnsActive[i].header
                                    ? styles['ct-table-colum-hover']
                                    : '',
                                  this.state.selectedColumn &&
                                  this.state.selectedColumn == columnsActive[i].header
                                    ? styles['ct-table-header-colum-selected']
                                    : '',
                                  styles['rt-td'],
                                ].join(' ')
                              }
                              onMouseOver={(e)=>this.hoverColumn(columnsActive[i].header)}
                              onMouseOut={(e)=>this.hoverColumn('', e)}
                              style={{
                                borderLeftColor: '#305f75',
                                borderLeftStyle: 'solid',
                                borderLeftWidth: 10,
                                margin: 3,
                                padding: 4,
                              }}
                            >
                              {value}
                            </div>
                          </div>
                        )
                      }
                      return null
                    })
                  : ''
              }
            </div>))}
        </div>

        {/* Navigation Move across the table using lines and pages */}
        <div
          className={styles.pageControl}
        >
          <input
            ref={(inputPageNumber) => {this.inputPageNumber = inputPageNumber;}}
            type="number"
            min="1"
            max={pageTotal? pageTotal: 1}
            onChange={(e) => {this.goToPage(parseInt(e.target.value));}}
            onKeyUp={(e) => {if (e.key == "Enter") this.goToPage(parseInt(e.target.value));}}
            style={stInput}
          /> page of {pageTotal? pageTotal: ''}
          <div>
            <input type="button"
              onClick={()=>this.goToPage(parseInt(this.inputGotoPageNumber.value))}
              title="Go to page"
              value="Go"
            /> to page
            <input
              ref={(inputGotoPageNumber) => this.inputGotoPageNumber = inputGotoPageNumber}
              type="number"
              min="1"
              max={pageTotal? pageTotal: 1}
              onChange={(e) => this.goToPage(parseInt(e.target.value))}
              onKeyUp={(e) => {if (e.key == "Enter") this.goToPage(parseInt(e.target.value));}}
              style={stInput}
            />
          </div>

          <div>
            <div
              className={styles.tableFastAdv}
            >
              Move line - Page - Home/End
            </div>
            <div
              style={{
                marginLeft: 40
              }}
            >
              <div>
                <i className="fa fa-chevron-down fa-1x" />
                <input type="button"
                  onClick={()=>this.move({row: 1})}
                  onMouseDown={() => this.timer = this.setMoveTimer({row: 1})}
                  onMouseUp={() => this.timer()}
                  onMouseLeave={() => this.timer? this.timer(): null}
                  title="Line up"
                />
                <input type="button"
                  onClick={()=>this.move({page: 1})}
                  onMouseDown={() => this.timer = this.setMoveTimer({page: 1})}
                  onMouseUp={()=> this.timer()}
                  onMouseLeave={() => this.timer? this.timer(): null}
                  title="Page up"
                />
                <input type="button"
                  onClick={()=>this.move({page: 10})}
                  onMouseDown={() => this.timer = this.setMoveTimer({page: 10})}
                  onMouseUp={()=> this.timer()}
                  onMouseLeave={() => this.timer? this.timer(): null}
                  title="Page up x10"
                />
                <input type="button" onClick={()=>this.move({page: pageTotal})}/>
              </div>
              <div>
                <i className="fa fa-chevron-up fa-1x" />
                <input type="button"
                  onClick={()=>this.move({row: -1})}
                  onMouseDown={() => this.timer = this.setMoveTimer({row: -1})}
                  onMouseUp={()=> this.timer()}
                  onMouseLeave={() => this.timer? this.timer(): null}
                  title="Line down"
                />
                <input type="button"
                  onClick={()=>this.move({page: -1})}
                  onMouseDown={() => this.timer = this.setMoveTimer({page: -1})}
                  onMouseUp={()=> this.timer()}
                  onMouseLeave={() => this.timer? this.timer(): null}
                  title="Page down"
                />
                <input type="button"
                  onClick={()=>this.move({page: -10})}
                  onMouseDown={() => this.timer = this.setMoveTimer({page: -10})}
                  onMouseUp={()=> this.timer()}
                  onMouseLeave={() => this.timer? this.timer(): null}
                  title="Page down x10"
                />
                <input type="button" onClick={()=>this.move({page: -pageTotal})}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// Generate index from data.
function generateIndex(data) {
  if (data.constructor.name == "Array") {
    // return [...Array(data.length).keys()]
    return Array(data.length).fill(0).map((e,i) => i)
  }

  return Object.keys(data)
}

// From header obtain row data accessor
// It have to types:
// accessor: "Object.keys"
// accessor: d => d.freq
function extractRowBlueprint(headers) {
  const recursiveLeafExtractor = (node) => {
    let dataAccessorList = []
    for (let item of node) {
      if (item.columns) {
        dataAccessorList = [
          ...dataAccessorList,
          ...recursiveLeafExtractor(item.columns)
        ]
      } else {
        dataAccessorList = [
          ...dataAccessorList,
          item.accessor
        ]
      }
    }
    return dataAccessorList
  }

  return recursiveLeafExtractor(headers)
}

function extractActiveheaders(headers) {
  const recursiveLeafExtractor = (node) => {
    let activeheaders = []
    for (let item of node) {
      if (item.columns) {
        activeheaders = [
          ...activeheaders,
          ...recursiveLeafExtractor(item.columns)
        ]
      } else {
        activeheaders = [
          ...activeheaders,
          item
        ]
      }
    }
    return activeheaders
  }

  return recursiveLeafExtractor(headers)
}

// Sorting table
function sorting({key = 'Object.keys', direction = 'asc', insensitive = false}, data)  {
  return (a, b) => {
    let _a, _b, nameA, nameB;

    switch (typeof key) {
      case 'function':
        _a = key(data[a])
        _b = key(data[b])
        break;
      case 'string':
        if (key == 'Object.keys') {
          _a = a
          _b = b
          break;
        }
        _a = data[a][key]
        _b = data[b][key]
        break;
    }

    // ignore upper and lowercase
    if (typeof _a == 'string' && insensitive) {
      _a = _a.toUpperCase();
      _b = _b.toUpperCase();
    }

    if (direction == 'desc') {
      nameA = _b
      nameB = _a
    } else {
      nameA = _a
      nameB = _b
    }

    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }

    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    // names must be equal
    return 0;
  }
}
