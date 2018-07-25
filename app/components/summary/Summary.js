// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Summary.css';

import QuestionCheckboxList from './QuestionCheckboxList';

import GraphPointsByTypeStats from './GraphPointsByTypeStats';
import CoursePointsGraph from './CoursePointsGraph';
import TextField from './TextField';

export default class Summary extends Component<Props> {
  props: Props;

  constructor() {
    super()
    this.state = {
      page: 1,
      sortOptions: {
        key: 'Object.keys',
        direction: 'asc',
        insensitive: true
        // (k)=>k.freq,'desc',true
      },
      rowBlueprint: [],
      showQuestions: []
    }
    this.pageTotal = 0
    this.ticking = false
  }

  componentDidMount() {
  }

  setShowQuestions(questions) {
    if (questions.constructor.name == "Array") {
      return this.setState({showQuestions: questions})
    }
    // Remove question?
    if (this.state.showQuestions.includes(questions)) {
      return this.setState({
        showQuestions: this.state
          .showQuestions.filter((e)=> e != questions)
      })
    }
    this.setState({
      showQuestions: [
        ...this.state.showQuestions,
        questions
      ]
    })
  }

  render() {
    const {
      columns,
      headers,
      rows,
      course,
      courseCode,
      state,
      infoBase
    } = this.props;

    // const data = this.state.data || this.props.data

    const stars = [0,1,2,3,4,5]
    const colors = {
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
      ],
      borderColor: [
        'rgba(255,99,132,1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(255,99,132,1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
    }

    const barData = ({
      label,
      data,
      backgroundColor,
      borderColor,
    }) => ({
      labels: stars,
      datasets: [
        {
          label,
          backgroundColor,
          borderColor,
          borderWidth: 1,
          hoverBackgroundColor: backgroundColor.replace(/0.2\)$/, '0.4)'),
          hoverBorderColor: borderColor,
          data: data
        }
      ]
    })

    let charts = []
    let curseCharts = {}
    let curseStars = new Array(6).fill(0)
    const questionMaxPoints = rows.length * 5

    // Jump first (index)
    charts = headers.slice(1).map((headerColumn, index) => {
      let questionStars = rows.reduce((result, fila) => {
        let value = parseInt(headerColumn.accessor(fila)) || 0
        result[value] += 1
        return result
      }, new Array(6).fill(0))

      curseStars = curseStars.map((element, index) => element + questionStars[index])

      const mean = questionStars.reduce((r, e, i) => r + (e * i), 0) / (rows.length - questionStars[0])
      const std = Math.sqrt( questionStars.reduce((r, e, i) => r + (e * (i - mean) ** 2), 0) / (rows.length - questionStars[0]) )
      const mad = questionStars.reduce((r, e, i) => r + (e * Math.abs(i - mean)), 0) / (rows.length - questionStars[0])
      const data = questionStars.map((element, i) => ({
        name: i,
        data: element,
        mean: parseFloat(mean.toFixed(2)),
        std: parseFloat(std.toFixed(2)),
        mad: parseFloat(mad.toFixed(2))
      }))

      const questionTotalPoints = questionStars.reduce((r, e, i) => r + (e * i), 0)
      // Show chart
      if (!this.state.showQuestions.includes(headerColumn.header)) {
        return
      }
      if (headerColumn.type == 'text') {
        return <TextField key={index} column={headerColumn} index={index} />
      }

      return (
        <div key={index}>
          <div >{headerColumn.title}</div>
          <div style={{paddingLeft: 40, margin: '16px 0'}}>
            <div
              style={{
                display: 'inline-block',
              }}
            >
              Question total theoretical points possible:
              <span
                style={{
                  marginLeft: 10,
                  fontSize: 14,
                }}
              >
                {questionMaxPoints}
              </span><br/>
              Question total points achieved:
              <span
                style={{
                  marginLeft: 10,
                  fontSize: 14,
                }}
              >
                {questionTotalPoints}
              </span>
              <div
                style={{
                  marginBottom: 16,
                }}
              >
                Total and aggregated points accross all answers
              </div>
              <CoursePointsGraph max={questionMaxPoints} points={questionTotalPoints}/>
            </div>

            <div
              style={{
                display: 'inline-block',
              }}
            >

              <GraphPointsByTypeStats
                data={data}
              />
            </div>
          </div>
        </div>
      )
    })

    // Mean across the 8 questions then rows.length * 8
    const mean = curseStars.reduce((r, e, i) => r + (e * i), 0) / (rows.length * 8 - curseStars[0])
    const std = Math.sqrt( curseStars.reduce((r, e, i) => r + (e * (i - mean) ** 2), 0) / (rows.length * 8 - curseStars[0]) )
    const mad = curseStars.reduce((r, e, i) => r + (e * Math.abs(i - mean)), 0) / (rows.length * 8 - curseStars[0])
    const data = curseStars.map((element, i) => ({
      name: i,
      data: element,
      mean: parseFloat(mean.toFixed(2)),
      std: parseFloat(std.toFixed(2)),
      mad: parseFloat(mad.toFixed(2))
    }))
    const maxPoints = rows.length * 8 * 5
    const pointsTotal = curseStars.reduce((r, e, i) => r + (e * i), 0)

    curseCharts = (
      <div
        // key={index}
      >
        <h3>
          Course total points and statistics
        </h3>
        <div style={{paddingLeft: 40, margin: '16px 0'}}>
          <div>
            Number of students participate in the poll: {rows.length}
          </div>

          <div
            style={{
              display: 'inline-block',
              // marginLeft: 20,
            }}
          >
            Total theoretical points possible (Perfect course):
            <span
              style={{
                marginLeft: 10,
                fontSize: 14,
              }}
            >
              {maxPoints}
            </span><br/>
            Total points achieved:
            <span
              style={{
                marginLeft: 10,
                fontSize: 14,
              }}
            >
              {pointsTotal}
            </span><br/>
            <div
              style={{
                marginBottom: 16,
              }}
            >
              Total and aggregated points accross all answers
            </div>
            <CoursePointsGraph max={maxPoints} points={pointsTotal}/>
          </div>

          <div
            style={{
              display: 'inline-block',
              // marginLeft: 20,
            }}
          >
            <GraphPointsByTypeStats
              data={data}
            />
          </div>
        </div>
      </div>
    )

    return (
      <React.Fragment>
        <div
          style={{
            color: 'black'
          }}
        >
          {/* {headers.slice(1).map((headerColumn, index) => {
            if (headerColumn.type !== 'text') {
              return
            }
            return <TextField key={index} column={headerColumn} index={index} />
          })} */}

          {curseCharts}
          <h3>
            Poll Questions Statistics
          </h3>
          <QuestionCheckboxList
            showQuestions={this.state.showQuestions}
            setShowQuestions={this.setShowQuestions.bind(this)}
            questions={headers.slice(1)}
          />

          {charts}
        </div>
      </React.Fragment>
    );
  }
}
