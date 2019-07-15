import React, { Component } from "react";
import { databaseRefs } from "./../../../lib/refs";
import { Formik, Form, Field } from "formik";
import { getToupleFromSnapshot } from "../../../lib/firebaseUtils";

const { question } = databaseRefs;
const { game } = databaseRefs;

class AddAnswerPage extends Component {
  questionRef = "";
  gameRef = '';
  state = {
    id: "",
    questionId: "",
    fakeAnswers: {},
    answer: "",
    question: "",
    isCorrectAnswer: false,
    correctAnswer: ''
  };

  componentDidMount() {
    const { gameId, questionId } = this.props.match.params;
    this.setState({
      gameId,
      questionId
    });

    this.questionRef = question(gameId, questionId);

    this.questionRef.on("value", snapshot => {
      const { question, answer: { value } } = snapshot.val();
      this.setState({
        question,
        correctAnswer: value
      });
    });
  }

  componentWillUnmount() {
    this.questionRef.off("value");
  }

  handleAnswerSubmit = async ({ answer }, actions) => {
    const { correctAnswer } = this.state;
    if (answer.toLowerCase() === correctAnswer.toLowerCase()) {
      this.setState({ isCorrectAnswer: true });
      return;
    }
    const {
      match: {
        params: { gameId }
      },
      history
    } = this.props;
    const playerInfo = JSON.parse(localStorage.getItem("playerInfo"));
    await this.questionRef.child("/fakeAnswers").push({
      value: answer,
      authorTeam: playerInfo.playerId,
      voteCount: 0,
      votedBy: {}
    });
    const gameRef = game(gameId);
    const currentScreen = {
      route: `/lobby/${gameId}/wait-players`
    };

    gameRef.child("/currentScreen").set(currentScreen);

    // actions.resetForm();
    history.push(`/lobby/${gameId}/wait-players`);
  };

  resetIsCorrectAnswer = () => {
    this.setState({ isCorrectAnswer: false });
  }

  render() {
    const { question, isCorrectAnswer } = this.state;
    return (
      <div>
        <div>
          Question:
          {JSON.stringify(question)}
        </div>
        Please add your answer:
        <Formik
          initialValues={{
            answer: ""
          }}
          onSubmit={this.handleAnswerSubmit}
          render={({ values, handleChange }) => (
            <Form>
              <Field
                id="answer"
                name="answer"
                type="text"
                placeholder="question answer"
                value={values.answer}
                onChange={(e) => { handleChange(e); this.resetIsCorrectAnswer(); }}
              />
              <br />
              {isCorrectAnswer ? (<div>You entered the correct answer. Please enter a fake one</div>) : ''}
              <button type="submit">Submit your bullshit</button>
            </Form>
          )}
        />
      </div>
    );
  }
}

export default AddAnswerPage;
