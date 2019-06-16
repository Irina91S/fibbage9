import React, { Component } from "react";
import { databaseRefs } from "./../../../lib/refs";
import { Formik, Form, Field } from "formik";

const { question } = databaseRefs;

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
  }

  componentWillUnmount() {
    this.questionRef.off("value");
  }

  handleAnswerSubmit = async ({ answer }, actions) => {
    await this.questionRef.child("/fakeAnswers").push({
      value: answer,
      authorTeam: localStorage.getItem("playerId"),
      voteCount: 0,
      votedBy: {}
    });
    this.setState({
      submittedAnswer: answer
    });
    actions.resetForm();
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
