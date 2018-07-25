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
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
} from 'recharts';

const CoursePointsGraph = ({max, points}) => {
  const data = [
    {
      name: 'Max possible',
      Points: max,
    },
    {
      name: 'Total',
      Points: points,
    }
  ];
  const activeIndex = 0;

  const stars = [0,1,2,3,4,5]

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const getCoordinates = (rad) => {
      const radius = innerRadius + (outerRadius - innerRadius) * rad;
      return [
        cx + radius * Math.cos(-midAngle * RADIAN),
        cy  + radius * Math.sin(-midAngle * RADIAN),
      ]
    }

    const [x, y] = getCoordinates(1.5);

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
          {
            index == 0
              ? `${(percent * 100).toFixed(0)}%`
              : ``
          }
        </text>
        {/* <text x={x2} y={y2} fill="#777" textAnchor={x > cx ? 'start' : 'end'} 	dominantBaseline="central">
          {`${index}`}
        </text> */}
      </React.Fragment>
    );
  };
  const COLOR = {
    blue: ['rgba(104, 184, 237, 1)', 'rgba(104, 184, 237, 0.7)'],
    grey: ['rgba(212, 212, 212, 1)', 'rgba(212, 212, 212, 0.7)'],
  }
  // debugger

  return (
    <React.Fragment>
      <div
        style={{
          display: 'inline-block'
        }}
      >
        <ComposedChart
          width={250}
          height={200}
          data={data}
          margin={{top: 20, right: 20, bottom: 20, left: 20}}
        >
          {/* <CartesianGrid stroke='#f5f5f5'/> */}
          <XAxis dataKey="name"/>
          {/* <YAxis /> */}
          {/* <Tooltip /> */}
          {/* <Tooltip
            offset={20}
            viewBox={{ x: 0, y: 0, width: 400, height: 400 }}
            wrapperStyle={{
              backgroundColor: 'rgba(255,255,255,0.9)'
            }}
            // itemStyle={{backgroundColor: 'rgba(99,99,99,0.8)'}}
          /> */}
          <Legend
             payload={[{ value: 'Total points achieved', type: 'line', id: 'ID01' }]}
             wrapperStyle={{
               color: 'rgba(0,0,0,0.9)',
               fontFamily: 'monospace',
               fontSize: 13,
             }}
          />
          <Bar
            dataKey='Points'
            barSize={50}
            stroke='rgba(255, 99, 132, 1)'
          >
          {
            data.map((entry, index) => (
              <Cell
                cursor="pointer"
                fill={
                  index === activeIndex
                    ? COLOR.grey[0]
                    : COLOR.blue[0]
                }
                stroke={
                  index === activeIndex
                  ? 'rgba(212, 212, 212, 0.7)'
                  : 'rgba(104, 184, 237, 0.7)'
                }
                key={`cell-${index}`}
              />
            ))
          }
            <LabelList
              dataKey='Points'
              position="top"
              fill='#555'
              stroke='none'
            />
          </Bar>
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
            data={[
              data[1],
              {
                ...data[0],
                Points: data[0].Points - data[1].Points
              }
            ]}
            dataKey='Points'
            cx={120}
            cy={80}
            innerRadius={50}
            outerRadius={60}
            fill="#82ca9d"
            label={renderCustomizedLabel}
            labelLine={false}
            nameKey="name"
          >
          {
            data.map((entry, index) => <Cell
              key={`cell-pie-${index}`}
              fill={
              index === activeIndex
                ? COLOR.blue[0]
                : COLOR.grey[0]
            }/>)
          }
          </Pie>
          <Legend
             payload={[{ value: 'Total points achieved percentage', type: 'line', id: 'ID01' }]}
             wrapperStyle={{
               color: 'rgba(0,0,0,0.9)',
               fontFamily: 'monospace',
               fontSize: 13,
             }}
          />
        </PieChart>
      </div>
    </React.Fragment>
  );
}

export default CoursePointsGraph
