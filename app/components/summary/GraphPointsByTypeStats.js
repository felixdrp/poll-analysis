import React, { Component } from 'react';
import styles from './Summary.css';
import {
  PieChart,
  Pie,
  ComposedChart,
  Line,
  Area,
  Bar,
  Cell,
  LabelList,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

export default class GraphPointsByTypeStats extends Component<Props> {
  props: Props;

  constructor() {
    super()
    this.state = {
      page: 1,
    }
    this.pageTotal = 0
    this.ticking = false
  }

  render() {
    const {
      data
    } = this.props;

    // const data = this.state.data || this.props.data
    const COLOR = {
      0: '#cccccc',
      1: '#ff6666',
      2: '#ffbf80',
      3: '#fff364',
      4: '#ccff66',
      5: '#5ddf61',
    }
    const stars = [0,1,2,3,4,5]
    let collisionTextPrevent = []
    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = (labelVars) => {
      let { cx, cy, midAngle, innerRadius, outerRadius, percent, index, name } = labelVars
      const getCoordinates = (rad) => {
        const radius = innerRadius + (outerRadius - innerRadius) * rad;
        return [
          cx + radius * Math.cos(-midAngle * RADIAN),
          cy + radius * Math.sin(-midAngle * RADIAN),
        ]
      }

      let [x, y] = getCoordinates(1.2);

      // collisionTextPrevent is reutilized multiple times
      // Init to [] if reused
      if (name == 0 && collisionTextPrevent.length != 0) {
        collisionTextPrevent = []
      }
      // Add space if it is text collision
      collisionTextPrevent.forEach((element, elementIndex, allElements) => {
        let [xElement, yElement] =  element
        const xDiff = xElement - x
        const yDiff = yElement - y
        let findHole = 1
        let collition = false
        // collision in x and y axys?
        if (Math.abs(xDiff) < 50 && Math.abs(yDiff) < 10) {
          // console.log('x,xPrev,xDiff,Math.abs(xDiff),y,yPrev,yDiff,Math.abs(yDiff)')
          // console.log(x,xPrev,xDiff,Math.abs(xDiff),y,yPrev,yDiff,Math.abs(yDiff))
          if (yDiff > 0) {
            y = y - (10 - yDiff) + 1
          } else {
            // Distance with previous is bigger than next one.
            if (elementIndex == 0 && Math.abs(yElement - allElements[allElements.length - 1][1]) > 20) {
              findHole = -1
            }

            do {
              y = y - findHole
              // No tropieza con otro
              collition = allElements.find(element => {
                let [ex, ey] = element
                return Math.abs(ex - x) < 50 && Math.abs(ey - y) < 10
              })
            } while (collition)
          }
        }
      })
      collisionTextPrevent.push([x, y])

      return (
        <React.Fragment>
          <text
            x={x}
            y={y}
            fill="#444"
            fontFamily="sans-serif"
            fontSize="13"
            textAnchor={x > cx ? 'start' : 'end'}
            dominantBaseline="central"
          >
          	{`${index}: ${(percent * 100).toFixed(0)}%`}
          </text>
        </React.Fragment>
      );
    };

    return (
      <React.Fragment>
        <div
          style={{
            display: 'inline-block'
          }}
        >
          <ComposedChart width={350} height={200} data={data}
              margin={{top: 20, right: 20, bottom: 20, left: 20}}>
            <CartesianGrid stroke='#f5f5f5'/>
            <XAxis dataKey="name"/>
            <YAxis />
            {/* <Tooltip /> */}
            <Tooltip
              offset={20}
              viewBox={{ x: 0, y: 0, width: 400, height: 400 }}
              wrapperStyle={{
                backgroundColor: 'rgba(255,255,255,0.9)'
              }}
              // itemStyle={{backgroundColor: 'rgba(99,99,99,0.8)'}}
            />
            <Legend
               payload={[{ value: 'Points per answer category', type: 'line', id: 'ID01' }]}
               wrapperStyle={{
                 color: 'rgba(0,0,0,0.9)',
                 fontFamily: 'monospace',
                 fontSize: 13,
               }}
            />
            <Bar
              dataKey='data'
              barSize={20}
            >
            {
              data.map((entry, index) => (
                <Cell
                  cursor="pointer"
                  fill={COLOR[index]}
                  stroke={COLOR[index]}
                  key={`cell-${index}`}
                />
              ))
            }
            <LabelList
              dataKey='data'
              position="top"
              fill='#555'
              stroke='none'
            />
            </Bar>
            <Line type='monotone' dataKey='data' stroke='#ff7300'/>
          </ComposedChart>
        </div>
        <div
          style={{
            display: 'inline-block',
            // marginLeft: 20,
          }}
        >
          <PieChart width={250} height={200}>
            <Pie
              data={data}
              dataKey='data'
              cx={120}
              cy={80}
              innerRadius={50}
              outerRadius={70}
              fill="#82ca9d"
              label={renderCustomizedLabel}
              labelLine={false}
              nameKey="name"
            >
            {
              data.map((entry, index) => (
                <Cell
                  key={`cell-pie-${index}`}
                  fill={COLOR[index]}
                />))
            }
            </Pie>
          </PieChart>
        </div>
        <div
          style={{
            display: 'inline-block'
          }}
        >
          <ComposedChart
            width={250}
            height={200}
            data={[
              {
                name: 'mean',
                value: data[0].mean,
              },
              {
                name: 'std',
                value: data[0].std,
              },
              {
                name: 'mad',
                value: data[0].mad,
              },
            ]}
            margin={{top: 20, right: 20, bottom: 20, left: 20}}
          >
            <CartesianGrid stroke='#f5f5f5'/>
            <XAxis dataKey="name"/>
            <YAxis />
            <Tooltip
              offset={20}
              wrapperStyle={{
                backgroundColor: 'rgba(255,255,255,0.9)'
              }}
              // itemStyle={{backgroundColor: 'rgba(99,99,99,0.8)'}}
            />
            <Legend wrapperStyle={{
              display: 'none',
            }}/>
            <Bar
              dataKey='value'
              barSize={20}
              stroke='rgba(255, 99, 132, 1)'
              fill='rgba(255, 99, 132, 0.8)'
              label={{
                position: 'top',
                // stroke: '#000',
                fill: '#999',
              }}
            />
          </ComposedChart>
        </div>
      </React.Fragment>
    );
  }
}
