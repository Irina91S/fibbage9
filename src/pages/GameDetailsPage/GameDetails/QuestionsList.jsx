import React, { Fragment } from "react";
import GameControls from "./GameControls";

const QuestionsList = ({ questions, gameId }) => {

  const renderListOfQuestions = () => {
    return questions.map(([key, questionData], index) => {
      const { question, answer, score } = questionData;
      return (
        <li key={key}>
          <h3>
            <span>
              ({index + 1}) {question}
            </span>
          </h3>
          <h4>
            The truth: {answer}
          </h4>
          <h4>
            Score: {score} 
          </h4>
          <h5>Question index: {questionData.index}</h5>
          <GameControls gameId={gameId} questionId={key}/>
          {index !== questions.length - 1 && <hr />}
        </li>
      );
    });
  };

  return (
    <Fragment>
      <h2>List of questions ({questions.length})</h2>
      <ul>{renderListOfQuestions()}</ul>
    </Fragment>
  );
};

export default QuestionsList;
