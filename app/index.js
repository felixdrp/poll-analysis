import React from 'react';
import { render } from 'react-dom';
import { bindActionCreators } from 'redux';
import { AppContainer } from 'react-hot-loader';
import Root from './containers/Root';
import { configureStore, history } from './store/configureStore';
import './app.global.css';

const { ipcRenderer } = require('electron');
const geetha = require('../../emotion/data/Geetha Selvaretnam.json');
const lynn = require('../../emotion/data/Lynn Bradley.json');
const store = configureStore({poll: {geetha, lynn}});
var data = require('./redux/data');
import extractInfo from './tools/extractInfo';

const loadData = bindActionCreators(data.creators.load, store.dispatch)

// API call to the backend to analyse the data.
ipcRenderer.send('analyzePoll', {
  data: geetha,
  name: 'geetha'
});

ipcRenderer.send('analyzePoll', {
  data: lynn,
  name: 'lynn'
});

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
