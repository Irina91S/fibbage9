import React, { Component } from "react";
import { databaseRefs } from "./../../../lib/refs";
import { Formik, Form, Field } from "formik";
import WaitingScreen from "../WaitingScreen/WaitingScreen";

import { Question, Timer } from "../../../shared";

const { lobby, game } = databaseRefs;

class AddAnswerPage extends Component {
  questionRef = "";
  gameRef = "";
  state = {
    id: "",
    questionId: "",
    fakeAnswers: {},
    answer: "",
    question: "",
    isCorrectAnswer: false,
    correctAnswer: '',
    isSubmitted: false,
    timerEndDate: '',
  };

  componentDidMount() {
    const { gameId, questionId } = this.props.match.params;
    this.setState({ gameId, questionId });

    this.questionRef = lobby(gameId, questionId);
    this.gameRef = game(gameId);

    this.questionRef.on("value", snapshot => {
      const {
        question,
        answer: { value }
      } = snapshot.val();
      console.log(snapshot.val());
      this.setState({ question, correctAnswer: value });
    });

    this.gameRef.child('/currentScreen').on('value', snapshot => {
      const { history } = this.props;
      if (snapshot.val()) {
        const { route } = snapshot.val();
        history.push(route);
      }
    });

    this.gameRef.child('/timer/endTime').on('value', snapshot => {
      this.setState({ timerEndDate: snapshot.val() })
    });
  }

  componentWillUnmount() {
    if (this.questionRef) {
      this.questionRef.off();
    }

    if (this.gameRef) {
      this.gameRef.off();
    }
  }

  handleAnswerSubmit = ({ answer }) => {
    const { correctAnswer } = this.state;

    if (answer.toLowerCase() === correctAnswer.toLowerCase()) {
      this.setState({ isCorrectAnswer: true });
      return;
    }

    this.setState({ isSubmitted: true });

    const playerInfo = JSON.parse(localStorage.getItem("playerInfo"));

    this.questionRef.child("/fakeAnswers").push({
      authorTeam: playerInfo.playerInfo.playerId,
      value: answer,
      voteCount: 0,
      votedBy: {}
    });

    this.gameRef.child("/currentScreen").on("value", snapshot => {
      const { history } = this.props;
      if (snapshot.val()) {
        const { route } = snapshot.val();
        history.push(route);
      }
    });
  };

  resetIsCorrectAnswer = () => {
    this.setState({ isCorrectAnswer: false });
  };

  render() {
    const { question, isCorrectAnswer, isSubmitted, timerEndDate } = this.state;
    return (
      <div>
        {timerEndDate &&
          <React.Fragment>
            {console.log(timerEndDate)}
            <Timer
              endTime={timerEndDate}
            />
          </React.Fragment>
        }
        <Question value={question} />
        <Formik
          initialValues={{
            answer: ""
          }}
          onSubmit={this.handleAnswerSubmit}
          render={({ values, handleChange }) => (
            <Form>
              <label htmlFor="answer">Please add your answer:</label>
              <Field
                id="answer"
                name="answer"
                type="text"
                placeholder="ANSWER"
                value={values.answer}
                onChange={e => {
                  handleChange(e);
                  this.resetIsCorrectAnswer();
                }}
              />
              {isCorrectAnswer ? (
                <div>
                  You entered the correct answer. Please enter a fake one
                </div>
              ) : (
                  ""
                )}
              <button type="submit">I HOPE IT WORKS</button>

              <footer>
                Answer your question, preferably with some bullshit answer to
                trick the other teams into picking your bullshit and get points
                when they do it
              </footer>
            </Form>
          )}
        />
        {isSubmitted && <WaitingScreen />}
      </div>
    );
  }
}

export default AddAnswerPage;
