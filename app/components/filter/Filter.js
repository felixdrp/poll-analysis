// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
var dataStore = require('../../redux/data');
import filterData from '../../tools/filter';
import extractInfo from '../../tools/extractInfo';
import apiCall from '../../tools/apiCall';

import NumericSelector from './NumericSelector';
import Dock from 'react-dock';

import styleConf from './style'

import {
  TiFilter as FilterIcon,
  TiRefresh as RefreshIcon,
  TiFlash as FlashIcon,
  TiBackspace as BackspaceIcon,
 } from 'react-icons/lib/ti'
// import TiCog from 'react-icons/lib/ti/cog'

type Props = {};

class Filter extends Component<Props> {
  props: Props;
  constructor(props) {
    super(props);

    this.state = {
      sidebarOpen: false,
      filterOptions: {
        // Example:
        // {
        //   id: 0,
        //   type: 'numeric',
        //   filter: [0, 1, 5]
        // },
        // {
        //   id: 1,
        //   type: 'numeric',
        //   filter: [2, 3, 4]
        // },
        // id3: {
        //   id: 3,
        //   filter: ['course', 'exam'],
        //   type: "string"
        // },
      },
    }

    this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
    this.filter = this.filter.bind(this)
    this.clearFilter = this.clearFilter.bind(this)
  }

  onSetSidebarOpen() {
    this.setState(state => ({sidebarOpen: !state.sidebarOpen}));
  }

  setFilter(field, value) {
    let { filterOptions } = this.state
    let { headers } = this.props
    let fieldID = 'id'+field
    let filter

    if (!filterOptions[fieldID]) {
      filterOptions[fieldID] = {
        id: field,
        filter: [value],
        type: headers[field].type,
      }
    } else {
      if (filterOptions[fieldID].type == 'numeric') {
        filter = filterOptions[fieldID].filter
        if (filter.includes(value)) {
          filter = filter.filter(e => e !== value)
          if (filter.length == 0) {
            delete filterOptions[fieldID]
          } else {
            filterOptions[fieldID].filter = filter
          }
        } else {
          filter.push(value)
        }
      } else {
        filterOptions[fieldID].filter = value.split(' ')
      }
    }
    this.setState({filterOptions});
    this.filter()
  }

  async clearFilter() {
    await this.setState({filterOptions: {}});
    await this.filter()
  }

  async filter() {
    let {
      filter,
      setFilteredData,
    } = this.props;
    let { filterOptions } = this.state

    setFilteredData(await filter(filterOptions))
  }

  render() {
    let {
      clearFilter,
      headers,
    } = this.props

    let { filterOptions } = this.state

    return (
      <div>
        <div style={styleConf.buttonContainer}>
          <button style={styleConf.filterButton} onClick={clearFilter}>Restore <RefreshIcon size={20}/></button>
          <span style={styleConf.spaciator}></span>
          <button style={styleConf.filterButton} onClick={this.onSetSidebarOpen}>Filter <FilterIcon  size={20}/></button>
          <button style={styleConf.filterButton} onClick={this.filter}>Apply <FlashIcon size={20}/></button>
        </div>
        <Dock position='left' isVisible={this.state.sidebarOpen} onVisibleChange={this.onSetSidebarOpen}>
          {/* you can pass a function as a child here */}
          <div style={styleConf.filterClose} onClick={this.onSetSidebarOpen}>
            <FilterIcon size={20}/><span style={styleConf.filterCloseText}>Filter settings</span>
            <div style={styleConf.filterCloseCross}>X</div>
          </div>
          <div style={styleConf.filterButtonSetting}>
            <button style={styleConf.filterButton} onClick={this.clearFilter}>Clear <BackspaceIcon size={20}/></button>
            <button style={styleConf.filterButton} onClick={this.filter}>Apply <FlashIcon size={20}/></button>
          </div>

          <ul style={styleConf.questions}>
            {headers.map((pollQuestion, questionId) => {
              if (pollQuestion.type == 'numeric') {
                return (
                  <li key={questionId} style={styleConf.questionsItem}>
                    <div>{pollQuestion.title}</div>
                    <NumericSelector
                      actives={
                        filterOptions[`id${questionId}`]
                          ? filterOptions[`id${questionId}`].filter
                          : []
                      }
                      action={
                        (numberValue)=>this.setFilter(questionId, numberValue)
                      }
                    />
                  </li>
                )
              }
              return (
                <li key={questionId} style={styleConf.questionsItem}>
                  <div>{pollQuestion.title}</div>
                  <input type="text"
                    onChange={
                      (event)=>this.setFilter(questionId, event.target.value)
                    }
                    value={
                      filterOptions[`id${questionId}`]
                        ? filterOptions[`id${questionId}`].filter.join(' ')
                        : ''
                    }
                  />
                </li>
              )
            })}
          </ul>
        </Dock>
      </div>
    );
  }
}

function mapStateToProps(state) {
  if (!state.data.raw) {
    return {
      course: null,
      courseCode: null
    }
  }

  let filter = async (filterOptions) => {
    // let data
    // let dataIndex
    let structuredInfo
    let analyzed

    let { data, index } = filterData(
      filterOptions,
      state.data.raw_analysed.rawData
    )

    if (data.length > 1) {
      // get
      analyzed = await apiCall('analyze', data)
      // extractInfo
      structuredInfo = extractInfo(data)
      // console.log(data)
      return {
        filtered: {...structuredInfo, index},
        filtered_analysed:  analyzed.payload,
      }
    }

    return {
      filtered: null,
      filtered_analysed:  null,
    }
  }

  return {
    // course: state.data.raw.course,
    // courseCode: state.data.raw.courseCode,
    // Function used to filter data
    filter,
    headers: state.data.raw.headers.slice(1)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setFilteredData: bindActionCreators(
      dataStore.creators.setFilteredData,
      dispatch),
    clearFilter: bindActionCreators(dataStore.creators.clearFilter, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Filter);
