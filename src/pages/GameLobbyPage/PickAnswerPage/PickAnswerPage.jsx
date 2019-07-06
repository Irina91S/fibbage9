import React, { Component } from "react";
import { databaseRefs } from "../../../lib/refs";
import { getToupleFromSnapshot } from "../../../lib/firebaseUtils";

const { lobby, game } = databaseRefs;

class PickAnswerPage extends Component {
  state = {
    allAnswers: [],
    disabled: false
  };

  setAnswer = (gameId, questionId, fakeAnswerId, playerId, playerName) => {
    this.setState({ disabled: true });
    const lobbyRef = lobby(gameId, questionId);
    lobbyRef
      .child("/fakeAnswers")
      .child(fakeAnswerId)
      .child("/votedBy")
      .child(playerId)
      .set(playerName);
  };

  setCorrectAnswer = (gameId, questionId, playerId, playerName) => {
    this.setState({ disabled: true })
    const lobbyRef = lobby(gameId, questionId);
    lobbyRef
      .child("/answer")
      .child("/votedBy")
      .child(playerId)
      .set(playerName);
  };

  selectCorrectAnswer = () => {
    const playerInfo = JSON.parse(localStorage.getItem("playerInfo"));
    const { playerId, playerName } = playerInfo;

    const {
      history,
      match: {
        params: { gameId, questionId }
      }
    } = this.props;

    this.setCorrectAnswer(gameId, questionId, playerId, playerName);

    history.push(`/lobby/${gameId}/wait-players`);
  };

  selectAnswer = fakeAnswerId => {
    const playerInfo = JSON.parse(localStorage.getItem("playerInfo"));
    const { playerId, playerName } = playerInfo;

    const {
      history,
      match: {
        params: { gameId, questionId }
      }
    } = this.props;

    this.setAnswer(gameId, questionId, fakeAnswerId, playerId, playerName);

    history.push(`/lobby/${gameId}/wait-players`);
  };

  componentDidMount() {
    const {
      match: {
        params: { gameId, questionId }
      }
    } = this.props;
    const lobbyRef = lobby(gameId, questionId);

    lobbyRef.on("value", snapshot => {
      const givenAnswers = snapshot.val().fakeAnswers;
      const correctAnswer = snapshot.val().answer;
      this.setState({ allAnswers: this.shuffleAnswers(getToupleFromSnapshot(givenAnswers), correctAnswer)});
    });
  }

  shuffleAnswers = (fakeAnswers, truth) => {
    const allAnswers = [...fakeAnswers, truth];
    const sorted = allAnswers.sort((a, b) => {
      const firstValue = a.value ? a.value.toLowerCase() : a[1].value;
      const secondValue = b.value ? b.value.toLowerCase() : b[1].value;
      if(firstValue < secondValue) {
        return -1;
      } else if (firstValue > secondValue) {
        return 1;
      }
      return 0;
    });
    return sorted;
  }

  render() {
    const { allAnswers, disabled } = this.state;
    console.log(allAnswers)
    return (
      <div>
        {allAnswers.map(answer => {
          if (answer.value) {
            return (
            <div key={answer.value}>
              <button disabled={disabled} onClick={() => this.selectCorrectAnswer(answer)}>{answer.value}</button>
            </div>
            )
          }
          const [key, data] = answer;
          return (
            <div key={key}>
              <button disabled={disabled} onClick={() => this.selectAnswer(key)}>{data.value}</button>
            </div>
          );
        })}
      </div>
    );
  }
}

export default PickAnswerPage;
