// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import data from '../redux/data';

const rootReducer = combineReducers({
  data,
  poll: function (state = {}, action) {
    switch (action.type) {
      // case INCREMENT_COUNTER:
      //   return state + 1;
      case 'ADD_ANALYSIS':
        if (!state.analysis) {
          state.analysis = {}
        }
        state.analysis[action.name] = Object.assign({}, action.value);
        return state;
      default:
        return state;
    }
  },
  router,
});
// console.log(data)
// debugger

export default rootReducer;
