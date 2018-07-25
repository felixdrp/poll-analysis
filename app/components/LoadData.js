// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.css';
var data = require('../redux/data');
import extractInfo from '../tools/extractInfo';
const { ipcRenderer, remote } = require('electron');

class LoadData extends Component<Props> {
  props: Props;

  loadFile() {
    ipcRenderer.send('OPEN_FILE_DIALOG', {});
  }

  processData(name) {
     let infoBase = name
     let poll = this.props.poll
     let analysed = poll.analysis[infoBase]
     let data = poll[infoBase]

     let extractedInfo = extractInfo(data)

     this.props.loadData({
       raw: {
         ...extractedInfo,
         //Name of the info. (geetha lynn )
         infoBase,
       },
       raw_analysed: analysed,
       filtered: {
         rows: extractedInfo.rows,
       },
       filtered_analysed: analysed,
     })
  }

  render() {
    const style = {
      li: {
        margin: 5,
      },
      button: {
        fontSize: 'x-large',
        color: '#555',
      }
    }

    const {
      dispatch,
      course,
      courseCode,
    } = this.props

    return (
      <div>
        <div className={styles.backButton} data-tid="backButton">
          <Link to="/">
            <i className="fa fa-arrow-left fa-2x" />
          </Link>
          <div
            style={{
              display: 'inline-block',
              paddingLeft: 15,
            }}
          >
            Course: {course}, Course Code: {courseCode}
          </div>
          <div
            style={{
              color: 'black'
            }}
          >
            <ul>
              <li style={style.li}>
                <button
                  style={style.button}
                  onClick={() => this.processData('geetha')}
                >
                  Load data1
                </button>
              </li>

              <li style={style.li}>
                <button
                  style={style.button}
                  onClick={() => this.processData('lynn')}
                >
                  Load data2
                </button>
              </li>

              <li style={style.li}>
                <button
                  style={style.button}
                  onClick={this.loadFile}
                >
                  Open file
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  if (!state.data.raw) {
    return {
      course: null,
      courseCode: null,
      poll: state.poll,
    }
  }

  return {
    course: state.data.raw.course,
    courseCode: state.data.raw.courseCode,
    poll: state.poll,
  }
}

function mapDispatchToProps(dispatch) {
  return {loadData: bindActionCreators(data.creators.load, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(LoadData);
