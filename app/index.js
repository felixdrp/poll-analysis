import React from 'react';
import { render } from 'react-dom';
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux';
import { AppContainer } from 'react-hot-loader';
import Root from './containers/Root';
import { configureStore, history } from './store/configureStore';
import './app.global.css';

const { ipcRenderer } = require('electron');

const store = configureStore({poll: {}});
var data = require('./redux/data');
import extractInfo from './tools/extractInfo';

const loadData = bindActionCreators(data.creators.load, store.dispatch)

// API responses:
// will save analysed data to the store.
ipcRenderer.on('analysedPoll', (event, props) => {
  store.dispatch({
    type: 'ADD_ANALYSIS',
    name: props.name,
    value: props.analysedPoll
  })
  console.log({event, props});
});

// Load new data from a file.
ipcRenderer.on('LOAD_DATA', (event, props) => {
  let {data, analysed} = props.payload
  let extractedInfo = extractInfo(data)
  loadData({
      raw: {
        ...extractedInfo,
      },
      raw_analysed: analysed,
      filtered: {
        rows: extractedInfo.rows,
      },
      filtered_analysed: analysed,
  })
});
// GOTO.
ipcRenderer.on('GOTO', (event, props) => {
  store.dispatch(push(props))
});

render(
  <AppContainer>
    <Root store={store} history={history} />
  </AppContainer>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./containers/Root', () => {
    const NextRoot = require('./containers/Root'); // eslint-disable-line global-require
    render(
      <AppContainer>
        <NextRoot store={store} history={history} />
      </AppContainer>,
      document.getElementById('root')
    );
  });
}
