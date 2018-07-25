import { createActions, createReducers } from 'redux-arc';

const { types, creators } = createActions('data', {
  load: null,
  setFilteredData: null,
  clearFilter: null,
  reset: null,
});

const INITIAL_STATE = {
  raw: null,
  raw_analysed: null,
  filtered: null,
  filtered_analysed: null,
};

let onLoad = (state, action) => ({
  ...state,
  ...action.payload,
});

const onSetFilteredData = (state, action) => {
  // if (
  //   !action.payload.filtered ||
  //   !action.payload.filtered_analysed
  // ) {
  //   return state
  // }

  return {
    ...state,
    ...action.payload,
  }
};

const onClearFilter = (state, action) => {
  if (!state.raw) {
    return INITIAL_STATE
  }

  return {
    ...state,
    filtered: state.raw,
    filtered_analysed: state.raw_analysed,
  }
}

const onReset = () => INITIAL_STATE;

const HANDLERS = {
  [types.LOAD]: onLoad,
  [types.SET_FILTERED_DATA]: onSetFilteredData,
  [types.CLEAR_FILTER]: onClearFilter,
  [types.RESET]: onReset,
};

export default createReducers(INITIAL_STATE, HANDLERS);

export { types, creators }

// Call example
// const temp = require('./redux/data')
// store.dispatch(temp.creators.setFilterdData({a:5}))
// store.dispatch(
// temp.creators.setFilterdData({
//   filtered: 5,
//   filtered_analysed: 6,
// }))
// debugger
