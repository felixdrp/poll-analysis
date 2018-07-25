import React, { Component } from 'react';

function NumericSelector(props) {
  let {
    actives,
    action,
  } = props

  actives = actives || []

  let numberValues = [0, 1, 2, 3, 4, 5]
  return (
    <div
      style={{
        width: 180,
        display: 'flex',
        justifyContent: 'space-evenly',
      }}
    >
      {
        numberValues.map( number => {
          return item(number, () => action(number), actives.includes(number))
        })
      }
    </div>
  )
}

function item(number, onClickAction, checked) {
  return (
    <span key={number}>
      <div style={{
        textAlign: 'center',
      }}>
        {number}
      </div>
      <input
        type="checkbox"
        name="feature"
        onClick={onClickAction}
        checked={checked}
      />
    </span>
  )
}


export default NumericSelector
