// @flow
import * as React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Link } from 'react-router-dom';
import { RoutedTabs, NavTab } from 'react-router-tabs';
import PresentPoll from './PresentPoll';
import SummaryPage from './SummaryPage';
import PresentSentiment from '../components/present-sentiment/PresentSentiment';
import Filter from '../components/filter/Filter';
import style from '../styles/react-router-tabs.css';


class Poll extends React.Component<Props> {
  constructor() {
    super()
  }
  props: Props;

  render() {
    let {
      match,
      course,
      courseCode,
      filteredData,
    } = this.props;
    let pageContainer = (<div> No information. Please, to check filter options </div>)

    if (!course) {
      return (
        <div>
          <Switch>
            <Redirect path="*" to={`/`} />
          </Switch>
        </div>
      )
    }

    if (filteredData) {
      pageContainer = (
        <div>
          <RoutedTabs
            startPathWith={match.path}
            className={style['routed-tabs']}
          >
            <NavTab
              to="/summary"
              className={style['nav-tab']}
              activeClassName={style['nav-tab-active']}
            >
              Summary
            </NavTab>
            <NavTab
              to="/data"
              className={style['nav-tab']}
              activeClassName={style['nav-tab-active']}
            >
              Data
            </NavTab>
            <NavTab
              to="/phrases"
              className={style['nav-tab']}
              activeClassName={style['nav-tab-active']}
            >
              Phrases
            </NavTab>
          </RoutedTabs>
          <div>
            <Switch>
              <Route path={`${match.path}/summary`} render={(props) => <SummaryPage {...props} isAuthed={true} />} />
              <Route path={`${match.path}/data`} component={PresentPoll} />
              <Route path={`${match.path}/phrases`} component={PresentSentiment} />
              <Redirect path="*" to={`${match.path}/summary`} />
            </Switch>
          </div>
        </div>
      )
    }

    return (
      <div>
        <div
          style={{
            paddingBottom: 5,
          }}
        >
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
        </div>
        <Filter />
        {pageContainer}
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
    filteredData: state.data.filtered,
  }
}

function mapDispatchToProps(dispatch) {
  // return {loadData: bindActionCreators(data.creators.load, dispatch)};
  return {dispatch};
}

export default connect(mapStateToProps, mapDispatchToProps)(Poll);
