import React, { Fragment } from "react";
import GameControls from "./GameControls";

const QuestionsList = ({ questions, gameId }) => {
  console.log(gameId)
  const renderListOfQuestions = () => {
    return questions.map(([key, questionData], index) => {
      const { question, answer } = questionData;
      return (
        <li key={key}>
          <h3>
            <span>
              ({index + 1}) {question}
            </span>
          </h3>
          <h4>{answer}</h4>
          {index !== questions.length - 1 && <hr />}
          <GameControls gameId={gameId} questionId={key}/>
        </li>
      );
    });
  };

  return (
    <Fragment>
      <h2>list of questions ({questions.length})</h2>
      <ul>{renderListOfQuestions()}</ul>
    </Fragment>
  );
};

export default QuestionsList;
