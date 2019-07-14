/* eslint-disable react-hooks/rules-of-hooks */
import React, { Fragment, Component } from "react";
import { databaseRefs } from "../../../lib/refs";
import { getToupleFromSnapshot } from "../../../lib/firebaseUtils";

const { game } = databaseRefs;
const { players } = databaseRefs;
class gameControls extends Component {
  state = {
    playersActive: [],
    ready: false
  };

  componentDidMount() {
    const { gameId } = this.props;
    const playerInfo = JSON.parse(localStorage.getItem("playerInfo"));
    const { playerId } = playerInfo;

    const activeGameRef = game(gameId);
    const activePlayer = players(gameId);

    this.setState({ playerId });

    activePlayer.on("value", snapshot => {
      if (snapshot.val()) {
        const players = getToupleFromSnapshot(snapshot.val());
        this.setState({ playersActive: players });
      }
    });

    activeGameRef.on("value", snapshot => {
      const currentGame = snapshot.val();
      getToupleFromSnapshot(currentGame);
    });
  }

  checkIfPlayersAreReady = playersActive => {
    const readyPlayers = [];
    playersActive.forEach(player => {
      const [key, data] = player;
      if (data.isReady) {
        readyPlayers.push(key);
      }
    });
    if (readyPlayers.length === playersActive.length) {

      this.setState({ ready: true });
    }
  };

  constructAvailableAnswerRoute = () => {
    const { gameId, questionId } = this.props;
    const { ready,playersActive } = this.state;

    const activeGameRef = game(gameId);
    const currentScreen = {
      route: `/lobby/${gameId}/${questionId}/pick-answer`
    };

    this.checkIfPlayersAreReady(playersActive);
    if (ready) {

      activeGameRef.child("/currentScreen").set(currentScreen);
    }
  };

  constructAvailableResultsRoute = () => {
    const { gameId, questionId } = this.props;
    const { ready,playersActive } = this.state;

    const activeGameRef = game(gameId);
    const currentScreen = {
      route: `/lobby/${gameId}/questions/${questionId}/results`
    };
    this.checkIfPlayersAreReady(playersActive);
    if (ready) {
      activeGameRef.child("/currentScreen").set(currentScreen);
    }
  };

  constructNextStepRoute = () => {
    const { gameId, questionId } = this.props;
    const { ready,playersActive } = this.state;

    const activeGameRef = game(gameId);
    const currentScreen = {
      route: `/lobby/${gameId}/questions/${questionId}/addAnswer`
    };
    this.checkIfPlayersAreReady(playersActive);
    if (ready) {
      activeGameRef.child("/currentScreen").set(currentScreen);
    }
  };

  render() {
    return (
      <Fragment>
        <button onClick={this.constructAvailableAnswerRoute}>
          Available Answers
        </button>
        <button onClick={this.constructAvailableResultsRoute}>
          Answer Results
        </button>
        <button onClick={this.constructNextStepRoute}>Next Question</button>
      </Fragment>
    );
  }
}

export default gameControls;
