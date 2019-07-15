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
      const { question } = snapshot.val();
      this.setState({
        question
      });
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

    // actions.resetForm();
    history.push(`/lobby/${gameId}/wait-players`);
  };

  render() {
    const { question } = this.state;
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
      </div>
    );
  }
}

export default AddAnswerPage;
