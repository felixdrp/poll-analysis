// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import styles from './Home.css';
const { ipcRenderer } = require('electron');

type Props = {};

class Home extends Component<Props> {
  props: Props;

  loadFile() {
    ipcRenderer.send('OPEN_FILE_DIALOG', {});
  }

  render() {
    return (
      <div>
        <div className={styles.container} data-tid="container">
          <h2 style={{marginLeft: '58px', color: '#888'}}>
            Student Opinion Miner
          </h2>
          <h2>Home</h2>
          <h3 onClick={this.loadFile}><a>Load data</a></h3>

          <h3>
            <Link
              to="/poll"
              style={
               this.props.course
                 ? {}
                 : {color: '#bbb'}
              }
            >
              to Poll
            </Link>
          </h3>
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
    }
  }

  return {
    course: state.data.raw.course,
    courseCode: state.data.raw.courseCode,
  }
}

export default connect(mapStateToProps)(Home);
