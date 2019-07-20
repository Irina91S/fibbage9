import React, { Component } from 'react';
import { databaseRefs } from './../../../lib/refs';
import { Formik, Form, Field } from 'formik';
import WaitingScreen from '../WaitingScreen/WaitingScreen';

import { Question, Timer } from '../../../shared';

const { question, game } = databaseRefs;

class AddAnswerPage extends Component {
  questionRef = '';
  gameRef = '';
  state = {
    id: '',
    questionId: '',
    fakeAnswers: {},
    answer: '',
    question: '',
    isCorrectAnswer: false,
    correctAnswer: '',
    isSubmitted: false
  };

  componentDidMount() {
    const { gameId, questionId } = this.props.match.params;
    this.setState({ gameId, questionId });

    this.questionRef = question(gameId, questionId);
    this.gameRef = game(gameId);

    this.questionRef.on('value', snapshot => {
      const {
        question,
        answer: { value }
      } = snapshot.val();

      this.setState({ question, correctAnswer: value });
    });

    this.gameRef.child('/currentScreen').on('value', snapshot => {
      const { history } = this.props;
      if (snapshot.val()) {
        const { route } = snapshot.val();
        history.push(route);
      }
    });
  }

  componentWillUnmount() {
    this.questionRef.off('value');
    this.gameRef.off('value');
  }

  handleAnswerSubmit = async ({ answer }, actions) => {
    const { correctAnswer } = this.state;
    if (answer.toLowerCase() === correctAnswer.toLowerCase()) {
      this.setState({ isCorrectAnswer: true });
      return;
    }
    this.setState({ isSubmitted: true });
    const {
      match: {
        params: { gameId }
      }
    } = this.props;
    const playerInfo = JSON.parse(localStorage.getItem('playerInfo'));
    await this.questionRef.child('/fakeAnswers').push({
      value: answer,
      authorTeam: playerInfo.playerId,
      voteCount: 0,
      votedBy: {}
    });
  };

  resetIsCorrectAnswer = () => {
    this.setState({ isCorrectAnswer: false });
  };

  render() {
    const { question, isCorrectAnswer, isSubmitted } = this.state;
    const future = new Date(new Date().getTime() + 30000);
    return (
      <div>
        <Timer endTime={future} />
        <Question value={question} />

        <Formik
          initialValues={{
            answer: ''
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
                ''
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
