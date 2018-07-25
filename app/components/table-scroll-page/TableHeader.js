import React, { Component } from 'react';
import styles from './Table.css';

export default class Tableheader extends Component<Props> {

  render() {
    const {
      columns,
      sortBy,
      selectedColumn,
      selectColumn,
      hoveringColumn,
      hoverColumn,
      columnHighlight,
    } = this.props;

    function recursiveheader(headerBluePrint) {
      let header = []
      let classNameAsc
      let classNameDesc

      for (let i of headerBluePrint) {
        if (i.columns) {
          header = [
            ...header,
            <div key={i.header}
              className={styles.headerLeaf}
              style={{
                // boxShadow: '0 2px 15px 0 rgba(0,0,0,0.15)'
              }}
            >
              <div>
                {i.header}
              </div>
              <div
                key={i.header+'-group'}
                className={styles.headerLeafContainer}
              >
                {recursiveheader(i.columns)}
              </div>
            </div>
          ]
          continue
        }

        switch (i.type) {
          case 'text':
            classNameAsc =  'fa fa-sort-alpha-asc fa-1x'
            classNameDesc = 'fa fa-sort-alpha-desc fa-1x'
            break;
          case 'numeric':
            classNameAsc =  'fa fa-sort-numeric-asc fa-1x'
            classNameDesc = 'fa fa-sort-numeric-desc fa-1x'
            break;
          default:
        }

        header.push(
          <div key={i.header}
            className={
              [
                selectedColumn == i.header
                  ? styles['ct-table-header-colum-selected']
                  : '',
                !columnHighlight &&
                hoveringColumn == i.header
                  ? styles['ct-table-colum-hover']
                  : '',
                styles.headerLeaf,
              ].join(' ')
            }
            onClick={
              (e)=>{
                sortBy({key: i.accessor});
                selectColumn(i.header, e);
              }
            }
            onMouseOver={(e)=>hoverColumn(i.header, e)}
            onMouseOut={(e)=>hoverColumn('', e)}
            style={{
              // color: selectedColumn == i.header? 'red' : 'inherit'
            }}
            title={i.title}
          >
            <span
              style={{
                marginLeft: 3,
                marginRight: 3,
              }}
            >
              {i.header}
            </span>
            <div style={{display: 'inline-block'}}>
              <i
                style={{
                  padding: 2,
                  paddingLeft: 4,
                  paddingRight: 4,
                }}
                className={classNameAsc}
                onClick={(e)=>{
                  e.stopPropagation()
                  sortBy({key: i.accessor, direction: 'asc'})
                }}
              />
              <i
                style={{
                  padding: 2,
                  paddingLeft: 4,
                  paddingRight: 4,
                }}
                className={classNameDesc}
                onClick={(e)=>{
                  e.stopPropagation()
                  sortBy({key: i.accessor, direction: 'desc'})
                }}
              />
            </div>
          </div>
        )
      }

      return header
    }

    let mainheader = recursiveheader(columns)
    // debugger

    return (
      <div
        className={styles.headerMain}
      >
        {mainheader}
      </div>
    )
  }
}
