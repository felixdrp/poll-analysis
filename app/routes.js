/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';
import App from './containers/App';
import HomePage from './containers/HomePage';
import LoadData from './components/LoadData';
import PresentPoll from './containers/PresentPoll';
import SummaryPage from './containers/SummaryPage';
import Poll from './containers/Poll';
import About from './components/About';

export default () => (
  <App>
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route path="/load" component={LoadData} />
      <Route path="/about" component={About} />
      <Route path="/poll" component={Poll} />
      <Route component={HomePage} />
    </Switch>
  </App>
);
