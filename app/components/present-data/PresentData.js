// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './PresentData.css';
import ReactDataGrid from 'react-data-grid';
import Phrase from '../phrase/Phrase';
import stylesPhrase from '../phrase/Phrase.css';
import TableScrollPage from '../table-scroll-page/TableScrollPage';

export default class PresentSentiment extends Component<Props> {
  props: Props;

  showPhrases(event) {
    let bigram = event.currentTarget.dataset.id
    this.setState({
      commentRaw: '',
      bigramSelected: bigram,
      phrases: Object.assign(
        [],
        this.props.state.poll.analysis[this.props.infoBase].bigramFreq.bigramFreq[bigram].phrases
      ),
      wordSelected: bigram.split(',')
    });
  }

  showPhrasesFromWords(event) {
    let word = event.currentTarget.dataset.id
    this.setState({
      commentRaw: '',
      wordSelected: word,
      phrases: Object.assign(
        [],
        this.props.state.poll.analysis[this.props.infoBase].invIdx.wordSet[word].phrases
      ),
      wordSelected: [word]
    });
  }

  showPhrasesFromWordsStemm(event) {
    let word = event.currentTarget.dataset.id
    this.setState({
      commentRaw: '',
      wordSelected: word,
      phrases: Object.assign(
        [],
        this.props.state.poll.analysis[this.props.infoBase].invIdx.wordSetStemm[word].phrases
      ),
      wordSelected: [word]
    });
  }

  showRawText(row, col) {
    let text = this.props.state.poll.analysis[this.props.infoBase].data[row].columns[col].val
    try {
      this.setState({
        commentRaw: {
          text,
          row,
          col
        }
      });
    } catch (error) {
      this.setState({ error });
    }
  }

  render() {
    const {
      columns,
      headers,
      rows,
      course,
      courseCode,
      state,
      infoBase,
      raw_analysed
    } = this.props;
    // debugger

    return (
      <React.Fragment>
        <div
          style={{
            color: 'black'
          }}
          // className={`counter ${styles.counter}`}
        >
          <div
            className={styles.presentColumns}
          >
            {/* Bigrams */}
            {
              headers
                ? <TableScrollPage
                    data={rows}
                    columns={headers}
                    clickEvent={this.showPhrases.bind(this)}
                    style={{
                      height: '50vh',
                    }}
                  />
                : ''
            }
          </div>

        </div>
      </React.Fragment>
    );
  }
}
