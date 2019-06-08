import React, { Component, Fragment } from "react";
import { databaseRefs } from "../../../lib/refs";
import { getToupleFromSnapshot } from "../../../lib/firebaseUtils";

const { lobby } = databaseRefs;

class PickAnswerPage extends Component {
  state = {
    fakeAnswers: []
  };

  setFakeAnswers = fakeAnswers => {
    this.setState({ fakeAnswers });
  };

  selectAnswer = fakeAnswerId => {
    const playerId = "player1";
    const playerName = "Nick Furry";
    // const playerId = localStorage.getItem('playerId')
    const {
      match: {
        params: { gameId, questionId }
      }
    } = this.props;

    const lobbyRef = lobby(gameId, questionId);

    lobbyRef
      .child("/fakeAnswers")
      .child(fakeAnswerId)
      .child("/votedBy")
      .child(playerId)
      .set(playerName);
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
            <Fragment>
              <div key={key}>{data.value}</div>
              <button onClick={() => this.selectAnswer(key)} key={key}>
                select answer
              </button>
            </Fragment>
          );
        })}
      </div>
    );
  }
}

export default PickAnswerPage;
