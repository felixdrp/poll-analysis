import React, { Component } from 'react';
import styles from './Summary.css';

const QuestionCheckboxList = ({
  showQuestions,
  questions,
  setShowQuestions
}) => {
  if (!questions) {
    return
  }

  const showAll = questions.map((question) => question.title)

  return (
    <div>
      <input
        type="button"
        value="Show all"
        onClick={
          ()=>setShowQuestions(showAll)
        }
        style={{marginLeft: 15}}
      />
      <input
        type="button"
        value="Hide all"
        onClick={()=>setShowQuestions([])}
        style={{marginLeft: 2}}
      />

      <ul>
      {
        questions && questions.map((question)=>{
          const title = question.title
          const header = question.header || title

          // debugger
          return (
            <li key={title}>
              <input
                type="checkbox"
                checked={showQuestions.includes(title)}
                onChange={()=>setShowQuestions(title)}
              />
              {title}
            </li>
          )
        })
      }
      </ul>
    </div>
  );
}

export default QuestionCheckboxList
