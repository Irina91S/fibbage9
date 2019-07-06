import React, { Component } from "react";
import { databaseRefs } from "./../../../lib/refs";
import { Formik, Form, Field } from "formik";
import { getToupleFromSnapshot } from "../../../lib/firebaseUtils";

const { question } = databaseRefs;
const { game } = databaseRefs;

class AddAnswerPage extends Component {
  questionRef = "";
  state = {
    id: "",
    questionId: "",
    fakeAnswers: {},
    answer: "",
    question: ""
  };

  componentDidMount() {
    const { gameId, questionId } = this.props.match.params;
    this.setState({
      gameId,
      questionId
    });

    this.questionRef = question(gameId, questionId);

    this.questionRef.on("value", snapshot => {
      if (!snapshot.val().fakeAnswers) {
        const { question } = snapshot.val();
        console.log(JSON.stringify(question));
        this.setState({
          question
        });
      } else {
        const { fakeAnswers } = snapshot.val();
        this.setState({
          question,
          fakeAnswers
        });
      }
    });

    const activeGameRef = game(gameId);
    activeGameRef.on("value", snapshot => {
      const currentGame = snapshot.val();
      console.log();
      getToupleFromSnapshot(currentGame);
    });
  }

  componentWillUnmount() {
    this.questionRef.off("value");
  }

  handleAnswerSubmit = async ({ answer }, actions) => {
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

    this.setState({
      submittedAnswer: answer
    });

    // actions.resetForm();
    history.push(`/lobby/${gameId}/wait-players`);
  };

  render() {
    const { question, submittedAnswer } = this.state;
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
          render={() => (
            <Form>
              <Field
                id="answer"
                name="answer"
                type="text"
                placeholder="question answer"
              />
              <br />
              <button type="submit">add answer</button>
            </Form>
          )}
        />
        {submittedAnswer && (
          <div>
            Your submitted answer:
            {submittedAnswer}
          </div>
        )}
      </div>
    );
  }
}

export default AddAnswerPage;
