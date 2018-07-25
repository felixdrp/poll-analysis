// @flow
import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import styles from './Phrase.css';
import reactStringReplace from 'react-string-replace'

export default class Phrase extends Component<Props> {
  props: Props;

  render() {
    const {
      onClick,
      phraseId,
      rowID,
      columnID,
      phrase,
      emotion,
      wordsSelected
    } = this.props;
    // let _styles = styles
    // let _reactStringReplace = reactStringReplace
    // // debugger
    let emotionOveral = ''
    if (emotion.score == 0) {
      emotionOveral = 'neutral'
    } else if (emotion.score > 0) {
      emotionOveral = 'positive'
    } else {
      emotionOveral = 'negative'
    }

    return (
      <div
        className={styles.phraseItem}
        data-id={phraseId}
        onClick={(e) => onClick('mlk' + e)}
      >
        <span
          className={[
            styles.rowID
          ].join(' ')}
          title="Row"
        >
          R {rowID}
        </span>
        <span
          className={[
            styles.columnID
          ].join(' ')}
          title="Column"
        >
          C {columnID}
        </span>
        <span
          className={[
            styles.phraseID
          ].join(' ')}
          title="Phrase"
        >
          P {phraseId}
        </span>
        <span
          className={[
            styles.emotion,
            emotion.score >= 0? styles.emotionPositive: styles.emotionNegative
          ].join(' ')}
          title="Emotion"
        >
          E {emotion.comparative.toFixed(3)} {emotionOveral}
        </span>

        {
          reactStringReplace(phrase,
            RegExp( `(${wordsSelected.join('|')})`, 'ig' ),
            (match, i) => (<span key={i} className={styles.highlightword}>{match}</span>)
          )
        }
      </div>
    );
  }
}
