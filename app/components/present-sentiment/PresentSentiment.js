// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import styles from './PresentSentiment.css';
import ReactDataGrid from 'react-data-grid';
import Phrase from '../phrase/Phrase';
import stylesPhrase from '../phrase/Phrase.css';
import TableScrollPage from '../table-scroll-page/TableScrollPage';

class PresentSentiment extends Component<Props> {
  props: Props;

  showPhrases(event) {
    let bigram = event.currentTarget.dataset.id
    this.setState({
      commentRaw: '',
      bigramSelected: bigram,
      phrases: Object.assign(
        [],
        this.props.bigrams.bigramFreq[bigram].phrases,
        // this.props.state.poll.analysis[this.props.infoBase].bigramFreq.bigramFreq[bigram].phrases
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
        this.props.words.wordSet[word].phrases
        // this.props.state.poll.analysis[this.props.infoBase].invIdx.wordSet[word].phrases
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
        this.props.words.wordSetStemm[word].phrases
        // this.props.state.poll.analysis[this.props.infoBase].invIdx.wordSetStemm[word].phrases
      ),
      wordSelected: [word]
    });
  }

  showRawText(row, col) {
    // let text = this.props.state.poll.analysis[this.props.infoBase].data[row].columns[col].val
    let text = this.props.data[row].columns[col].val
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
      bigrams,
      words,
      phrases,
      index,
    } = this.props;

    // let bigrams = raw_analysed? raw_analysed.bigramFreq : null;
    // let words = raw_analysed? raw_analysed.invIdx : null;

    // debugger

    // let orderedBigrams = bigrams? Object.assign([], bigrams.bigramFreqIndexUnsort).sort() : []
    let orderedBigrams = bigrams?
      Object.assign([], bigrams.bigramFreqIndex).sort((a,b) => (bigrams.bigramFreq[b].freq < bigrams.bigramFreq[a].freq)).reverse() :
      []

    let totalPhraseSentiment = this.state?
      this.state.phrases.reduceRight( (a, b, i, z) => {
        // if (state.poll.analysis[infoBase].phrases.phrases) {
        if (phrases.phrases) {
          let _phrase = phrases.phrases[b]
          if (i == 0) {
            return ( (a + _phrase.emotion.comparative) / z.length ).toFixed(3)
          }
          return a + _phrase.emotion.comparative
        }
        return a
      },
      0)
      : null

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
            <TableScrollPage
              data={bigrams? bigrams.bigramFreq: []}
              columns={[
                {
                  header: "Bigrams Frequency",
                  columns: [
                    {
                      header: "Bigram",
                      type: 'text',
                      accessor: "Object.keys"
                    },
                    {
                      header: "Frequency",
                      type: 'numeric',
                      id: "freq",
                      accessor: d => d.freq
                    }
                  ]
                }
              ]}
              clickEvent={this.showPhrases.bind(this)}
              style={{
                height: '50vh',
              }}
              expandText="false"
              columnHighlight="false"
            />

            {/* <WordList/> */}
            <TableScrollPage
              data={words? words.wordSet: []}
              columns={[
                {
                  header: "Comments' words",
                  columns: [
                    {
                      header: "Words",
                      type: 'text',
                      accessor: "Object.keys"
                    },
                    {
                      header: "Frequency",
                      type: 'numeric',
                      id: "total",
                      accessor: d => d.total
                    }
                  ]
                }
              ]}
              clickEvent={this.showPhrasesFromWords.bind(this)}
              style={{
                height: '50vh',
              }}
              expandText="false"
              columnHighlight="false"
            />

            {/* <WordList/>  Stemmed*/}
            <TableScrollPage
              data={words? words.wordSetStemm: []}
              columns={[
                {
                  header: "Comments' words Stemmed",
                  columns: [
                    {
                      header: "Words",
                      type: 'text',
                      accessor: "Object.keys"
                    },
                    {
                      header: "Frequency",
                      type: 'numeric',
                      id: "total",
                      accessor: d => d.total
                    }
                  ]
                }
              ]}
              clickEvent={this.showPhrasesFromWordsStemm.bind(this)}
              style={{
                height: '50vh',
              }}
              expandText="false"
              columnHighlight="false"
            />
          </div>

          <div
            style={{
              height: 'auto',
              color: '#333'
            }}
          >
            {/* Phrases */}
            <div
              style={{
                height: '200px',
                color: '#333',
                margin: 20,
                overflowY: 'scroll',
              }}
            >
              {
                this.state?
                  this.state.phrases.map( (b, i) => {
                    if (phrases.phrases) {
                      let _phrase = phrases.phrases[b]
                      return (
                        <Phrase
                          key={i}
                          onClick={(e) => this.showRawText(_phrase.position.rowID, _phrase.position.columnID)}
                          phraseId={b}
                          rowID={index? index[_phrase.position.rowID] : _phrase.position.rowID}
                          columnID={_phrase.position.columnID}
                          phrase={_phrase.original}
                          emotion={_phrase.emotion}
                          wordsSelected={this.state.wordSelected}
                        />
                      )
                    }
                    return ''
                  }) :
                  'No phrases'
              }
            </div>
            <div
              style={{
                color: totalPhraseSentiment != null
                  ? totalPhraseSentiment >= 0
                    ? '#39da39'
                    : '#f58888'
                  : '#333'
              }}
            >
            {
              totalPhraseSentiment == null
                ? 'No Statistics'
                : `Total phrases sentiment: ${totalPhraseSentiment} ${totalPhraseSentiment >= 0? 'positive' : 'negative'}`

            }
            </div>
            {/* Raw Comments */}
            <div
              style={{
                height: '200px',
                color: '#333',
                overflowY: 'scroll',
                margin: 20
              }}
            >
              {
                this.state && this.state.commentRaw?
                 (<div className={stylesPhrase.phraseItem}>
                   <span
                     className={[
                       stylesPhrase.rowID
                     ].join(' ')}
                     title="Row"
                   >
                     R {this.state.commentRaw.row}
                   </span>
                   <span
                     className={[
                       stylesPhrase.columnID
                     ].join(' ')}
                     title="Column"
                   >
                     C {this.state.commentRaw.col}
                   </span>
                   {this.state.commentRaw.text}
                 </div>)
                  :
                  ''
              }
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  let {
    raw,
    filtered_analysed,
    filtered
  } = state.data

  if (filtered == null) {
    return {
      data: [],
      bigrams: [],
      words: [],
      phrases: [],
      index: [],
    };
  }

  return {
    data: filtered_analysed.data,
    bigrams: filtered_analysed.bigramFreq,
    words: filtered_analysed.invIdx,
    phrases: filtered_analysed.phrases,
    index: filtered.index,
  };
}

function mapDispatchToProps(dispatch) {
  return {dispatch};
}

export default connect(mapStateToProps, mapDispatchToProps)(PresentSentiment);
