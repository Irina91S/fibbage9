import React, { Component } from "react";
import { databaseRefs } from "../../../lib/refs";
import { getToupleFromSnapshot } from "../../../lib/firebaseUtils";

const { lobby, game } = databaseRefs;

class PickAnswerPage extends Component {
  state = {
    fakeAnswers: []
  };

  setFakeAnswers = fakeAnswers => {
    this.setState({ fakeAnswers });
  };

  setAnswer = (gameId, questionId, fakeAnswerId, playerId, playerName) => {
    const lobbyRef = lobby(gameId, questionId);
    lobbyRef
      .child("/fakeAnswers")
      .child(fakeAnswerId)
      .child("/votedBy")
      .child(playerId)
      .set(playerName);
  };

  removeAnswer = (gameId, questionId, fakeAnswerId, playerId) => {
    const { fakeAnswers } = this.state;
    const lobbyRef = lobby(gameId, questionId);

    fakeAnswers.forEach(item => {
      const [key, data] = item;

      if (fakeAnswerId === key) {
        return;
      }
debugger
      if (Object.keys(data.votedBy).includes(playerId)) {
        lobbyRef
          .child("/fakeAnswers")
          .child(key)
          .child("/votedBy")
          .child(playerId)
          .remove()
          .then(() => {});
      }
    });
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
    this.removeAnswer(gameId, questionId, fakeAnswerId, playerId);

    setTimeout(() => {
      history.push(`/lobby/${gameId}/wait-players`);
    }, 10000);
  };

  componentDidMount() {
    const {
      match: {
        params: { gameId, questionId }
      }
    } = this.props;
    const lobbyRef = lobby(gameId, questionId);
    const currentGameRef = game(gameId);

    currentGameRef.on("value", snapshot => {
      const currentGame = snapshot.val();
      getToupleFromSnapshot(currentGame);
    });

    lobbyRef.on("value", snapshot => {
      const givenAnswers = snapshot.val().fakeAnswers;
      this.setFakeAnswers(getToupleFromSnapshot(givenAnswers));
    });
  }

  render() {
    const { fakeAnswers } = this.state;
    return (
      <div>
        {fakeAnswers.map(answer => {
          const [key, data] = answer;
          return (
            <div key={key}>
              <div onClick={() => this.selectAnswer(key)}>{data.value}</div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default PickAnswerPage;
