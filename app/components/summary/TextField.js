import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  BarChart,
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

class TextField extends Component {
  constructor() {
    super()
    this.state = {
    }
  }

  render() {
    const {
      column,
      index,
      // headers,
      // rows,
      // state,
      colWordsFreq,
      colWordsFreqSteam,
      colbigrams,
      totalWordsColumn,
      totalPhrases,
      emptyComents,
      larger,
      shorter,
      positive,
      negative,
    } = this.props;
    // console.log(column)
    const style = {
      divInline: {
        display: 'inline-block',
      }
    }
    const fillOpacityStyle = '0.8'
    const barSizeStyle = 15
    const wordsFreq = colWordsFreq.map(e => ({word:e.word, frequency: e.freq}))
    const wordsFreqSteam = colWordsFreqSteam.map(e => ({word:e.word, frequency: e.freq}))
    const bigrams = colbigrams.map(e => ({bigram:e.bigram, frequency: e.freq}))

    // {/* Words Frequency */}
    const wordsFreqGraph = (
      <ComposedChart layout="vertical" width={280} height={290} data={wordsFreq}
        margin={{top: 5, right: 20, left: 50, bottom: 5}}>
        <CartesianGrid strokeDasharray="3 3"/>
        <XAxis type="number"/>
        <YAxis dataKey="word" type="category"/>
        <Tooltip/>
        <Legend
          payload={[{ value: 'Words Frequency', type: 'line', id: 'ID01' }]}
          wrapperStyle={{
            color: 'rgba(0,0,0,0.9)',
            fontFamily: 'monospace',
            fontSize: 13,
          }}
        />
        <Bar
          dataKey="frequency"
          barSize={barSizeStyle}
          fill="#10c301"
          fillOpacity={fillOpacityStyle}
          label={{ position: 'right', fill: '#999' }}
        />
      </ComposedChart>
    )

    // {/* Steamed Words Frequency */}
    const wordsFreqSteamGraph = (
      <ComposedChart layout="vertical" width={280} height={290} data={wordsFreqSteam}
        margin={{top: 5, right: 20, left: 50, bottom: 5}}>
        <CartesianGrid strokeDasharray="3 3"/>
        <XAxis type="number"/>
        <YAxis dataKey="word" type="category"/>
        <Tooltip/>
        <Legend
          payload={[{ value: 'Steamed Words Frequency', type: 'line', id: 'ID01' }]}
          wrapperStyle={{
            color: 'rgba(0,0,0,0.9)',
            fontFamily: 'monospace',
            fontSize: 13,
          }}
        />
        <Bar
          dataKey="frequency"
          barSize={barSizeStyle}
          fill="#d8d72a"
          fillOpacity={fillOpacityStyle}
          label={{ position: 'right', fill: '#999' }}
        />
      </ComposedChart>
    )

    // {/* Bigrams Frequency */}
    const bigramsGraph = (
      <ComposedChart layout="vertical" width={380} height={290} data={bigrams}
        margin={{top: 5, right: 30, left: 120, bottom: 5}}>
        <CartesianGrid strokeDasharray="3 3"/>
        <XAxis type="number"/>
        <YAxis dataKey="bigram" type="category"/>
        <Tooltip/>
        <Legend
          payload={[{ value: 'Bigrams Frequency', type: 'line', id: 'ID01' }]}
          wrapperStyle={{
            color: 'rgba(0,0,0,0.9)',
            fontFamily: 'monospace',
            fontSize: 13,
          }}
        />
        <Bar
          dataKey="frequency"
          barSize={barSizeStyle}
          fill="#8884d8"
          fillOpacity={fillOpacityStyle}
          label={{ position: 'right', fill: '#999' }}
        />
      </ComposedChart>
    )

    return (
      <div>
        <div style={{}}>{column.title}</div>
        <ul>
          <li>
            Total words <span> {totalWordsColumn} </span>
          </li>
          <li>
            Total phrases <span> {totalPhrases} </span>
          </li>
          <li>
            Empty comments <span> {emptyComents} </span>
          </li>
        </ul>

        <div style={style.divInline}>
          {wordsFreqGraph}
        </div>

        <div style={style.divInline}>
          {wordsFreqSteamGraph}
        </div>

        <div style={style.divInline}>
          {bigramsGraph}
        </div>

        <div style={{maxWidth: 800}}>
          <ul>
            <li>
              Shortest comment:
              <span
                style={{
                  fontSize: 13.5,
                  color: '#555',
                  paddingLeft: 10,
                }}
              >
                {shorter}
              </span>
            </li>
            <li
              style={{
                marginBottom: 5,
              }}
            >
              Largest comment:
              <span
                style={{
                  fontSize: 13.5,
                  color: '#555',
                  paddingLeft: 10,
                }}
              >
                {larger}
              </span>
            </li>
            <li>
              Phrases ranked by positive emotion probability:
            </li>
            <li>
              Top 5: <ul>{positive.map((phrase, index) => (
                <li key={index} style={{listStyle: 'circle'}}>
                  <span style={{fontSize: 13.5, color: '#555'}}>{phrase}</span>
                </li>
              ))}
              </ul>
            </li>
            <li>
              Bottom 5:
              <ul>{negative.map((phrase, index) => (
                <li key={index} style={{listStyle: 'circle'}}>
                  <span style={{fontSize: 13.5, color: '#555'}}>{phrase}</span>
                </li>
              ))}
              </ul>
            </li>
          </ul>
        </div>
      </div>
    )
  }
}

const getBigramsMoreFrequent = (bigramFreq, numberBigrams = 5) => {
  let BigramFreqSorted = []
  // Sort words by freq.
  for (let brigram in bigramFreq) {
    let freq = bigramFreq[brigram].freq
    BigramFreqSorted[freq] = BigramFreqSorted[freq]
      ? [...BigramFreqSorted[freq], brigram]
      : [brigram]
  }
  // Get numberWords of More used words.
  let index = BigramFreqSorted.length - 1
  let bigramsFreqOb = []
  for (let bigrams of BigramFreqSorted.reverse()) {
    if (bigrams) {
      for (let bigram of bigrams) {
        bigramsFreqOb.push({freq: index, bigram})
        if (bigramsFreqOb.length >= numberBigrams) {
          break
        }
      }
    }
    index--
    if (bigramsFreqOb.length >= numberBigrams) {
      break
    }
  }
  return bigramsFreqOb
}

const getWordsMoreFrequent = (wordSet, numberWords = 5) => {
  let WordsFreq = []
  // Sort words by freq.
  for (let word in wordSet) {
    let total = wordSet[word].total
    WordsFreq[total] = WordsFreq[total]
      ? [...WordsFreq[total], word]
      : [word]
  }
  // Get numberWords of More used words.
  let index = WordsFreq.length - 1
  let wordsFreqOb = []
  for (let words of WordsFreq.reverse()) {
    if (words) {
      for (let word of words) {
        wordsFreqOb.push({freq: index, word})
        if (wordsFreqOb.length >= numberWords) {
          break
        }
      }
    }

    index--
    if (wordsFreqOb.length >= numberWords) {
      break
    }
  }
  return wordsFreqOb
}

function mapStateToProps(state, ownProps) {
  // console.time('parte')
  // console.time('total')
  let phrases = state.data.filtered_analysed.phrases
  const columnID = ownProps.index

  // Statistics for total
  let wordSet = state.data.raw_analysed.invIdx.wordSet
  let wordSetStemm = state.data.raw_analysed.invIdx.wordSetStemm
  let bigrams = getBigramsMoreFrequent(state.data.raw_analysed.bigramFreq.bigramFreq, 10)
  let WordsFreq = getWordsMoreFrequent(wordSet, 10)
  let WordsFreqSteam = getWordsMoreFrequent(wordSetStemm, 10)

  let emptyComents = 0
  let larger = ''
  let shorter = 'pneumonoultramicroscopicsilicovolcanoconiosis'
  state.data.filtered.rows.forEach(e=> {
    const id = columnID+2
    let text = e['ID'+id]
    if (text.length == 0) {
      emptyComents += 1
    }
    if (text.length > larger.length) {
      larger = text
    }
    if (text.length > 1 && text.length < shorter.length) {
      shorter = text
    }
  })
  let filteredPhrases = state.data.filtered_analysed.phrases.phrases
  let emotional = state.data.filtered_analysed.phrases.phrasesIndex.sort((a, b) => filteredPhrases[b].emotion.comparative - filteredPhrases[a].emotion.comparative)

  // console.timeEnd('parte')

  // Statistics for text column
  // Get phrases by column
  let phrasesByColumn = phrases.phrasesIndex.filter((element)=> phrases.phrases[element].position.columnID == columnID)
  const getTotalWords = (phrasesIndexes, phrases) => {
    let total = 0
    for (const phraseIndex of phrasesIndexes) {
      total += phrases.phrases[phraseIndex].originalTokenized.length
    }
    return total
  }
  const totalWords = getTotalWords(phrases.phrasesIndex, phrases)
  const totalWordsColumn = getTotalWords(phrasesByColumn, phrases)

  let columnWordsFreq = {}
  let columnSteamWordsFreq = {}
  let columnsBigramsFromStopWordized = {}
  for (const phraseIndex of phrasesByColumn) {
    phrases.phrases[phraseIndex].stopWordized.forEach(word => {
      const wordLowerCase = word.toLowerCase()
      columnWordsFreq[wordLowerCase]
        ? columnWordsFreq[wordLowerCase].total += 1
        : columnWordsFreq[wordLowerCase] = {total: 1}
    })
    phrases.phrases[phraseIndex].stemmingFromStopWordized.forEach(word => {
      const wordLowerCase = word.toLowerCase()
      columnSteamWordsFreq[wordLowerCase]
        ? columnSteamWordsFreq[wordLowerCase].total += 1
        : columnSteamWordsFreq[wordLowerCase] = {total: 1}
    })
    phrases.phrases[phraseIndex].bigramsFromStopWordized.forEach(bigram => {
      let key = bigram.sort().join(',').toLowerCase()
      columnsBigramsFromStopWordized[key]
        ? columnsBigramsFromStopWordized[key].freq += 1
        : columnsBigramsFromStopWordized[key] = {freq: 1}
    })
    let text = phrases.phrases[phraseIndex].original
  }

  let colWordsFreq = getWordsMoreFrequent(columnWordsFreq, 10)
  let colWordsFreqSteam = getWordsMoreFrequent(columnSteamWordsFreq, 10)
  let colbigrams = getBigramsMoreFrequent(columnsBigramsFromStopWordized, 10)

  let positive = []
  let negative = []
  let numberPhrases = 5
  for (let phrase of emotional) {
    if (phrasesByColumn.includes(phrase)) {
      positive.push(phrases.phrases[phrase].original)
    }
    if (positive.length == numberPhrases) {
      break
    }
  }
  for (let phrase of emotional.reverse()) {
    if (phrasesByColumn.includes(phrase)) {
      negative.push(phrases.phrases[phrase].original)
    }
    if (negative.length == numberPhrases) {
      break
    }
  }
  // console.timeEnd('total')

//["bigramsFromStopWordized",
 // "emotion",
 //  "id",
 //   "original",
 //   "originalTokenized",
 //    "position", "stemmingFromStopWordized", "stopWordized"]
  // debugger
  if (!state.data.raw) {
    return {
      course: null,
      courseCode: null,
      poll: state.poll,
    }
  }

  return {
    course: state.data.raw.course,
    courseCode: state.data.raw.courseCode,
    poll: state.poll,
    colWordsFreq,
    colWordsFreqSteam,
    colbigrams,
    totalWordsColumn,
    totalPhrases: phrasesByColumn.length,
    emptyComents,
    larger,
    shorter,
    positive,
    negative,
  }
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(TextField);
