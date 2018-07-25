/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';
import App from './containers/App';
import HomePage from './containers/HomePage';
import LoadData from './components/LoadData';
import PresentPoll from './containers/PresentPoll';
import SummaryPage from './containers/SummaryPage';
import Poll from './containers/Poll';

export default () => (
  <App>
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route path="/load" component={LoadData} />
      <Route path="/geetha/data" component={SummaryPage} />
      <Route path="/geetha" component={PresentPoll} />
      <Route path="/lynn/data" component={SummaryPage} />
      <Route path="/lynn" component={PresentPoll} />
      <Route path="/poll" component={Poll} />
      <Route component={HomePage} />
    </Switch>
  </App>
);
