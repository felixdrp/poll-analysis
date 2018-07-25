// @flow
import { createActions } from 'redux-arc';

const { types, creators } = createActions('starWars', {
  addJedi: null,
});

type actionType = {
  +type: string
};

export const DATA_LOAD = 'DATA_LOAD';
// Filter data.
export const DATA_FILTER = 'DATA_FILTER';
export const FILTER_CONFIG_UPDATE = 'DECREMENT_COUNTER';

export function dataLoad() {
  return {
    type: DATA_LOAD
  };
}

export function decrement() {
  return {
    type: DECREMENT_COUNTER
  };
}

export function incrementIfOdd() {
  return (dispatch: (action: actionType) => void, getState: () => counterStateType) => {
    const { counter } = getState();

    if (counter % 2 === 0) {
      return;
    }

    dispatch(increment());
  };
}

export function incrementAsync(delay: number = 1000) {
  return (dispatch: (action: actionType) => void) => {
    setTimeout(() => {
      dispatch(increment());
    }, delay);
  };
}
