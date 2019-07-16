import React from 'react';

import './Question.scss';

const Question = ({value}) => {
  return (
    <h4 className="question">
      {value}
    </h4>
  )
}

export default Question
