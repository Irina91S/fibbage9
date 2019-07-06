/* eslint-disable react-hooks/rules-of-hooks */
import React, { Fragment, Component } from "react";
import { databaseRefs } from "../../../lib/refs";
import { getToupleFromSnapshot } from "../../../lib/firebaseUtils";

const { game } = databaseRefs;
const { players } = databaseRefs;
class gameControls extends Component {
  state = {
    playes: [],
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
      const players = snapshot.val();
      if (players) {
        this.setState({ players: getToupleFromSnapshot(players) });
      }
    });

    activeGameRef.on("value", snapshot => {
      const currentGame = snapshot.val();
      getToupleFromSnapshot(currentGame);
    });
  }

  checkIfPlayersAreReady = players => {
    players.forEach(player => {
      const [key, data] = player;
      const readyPlayers = []

      debugger;
      if (data.isReady) {
        readyPlayers.push(key)
        this.setState({ isReady: true });
      }
    });
  };

  constructAvailableAnswerRoute = () => {
    const { gameId, questionId } = this.props;
    const { ready, players } = this.state;

    const activeGameRef = game(gameId);
    const currentScreen = {
      route: `/lobby/${gameId}/${questionId}/pick-answer`
    };
    this.checkIfPlayersAreReady(players);
    if (ready) {
      activeGameRef.child("/currentScreen").set(currentScreen);
    }
  };

  constructAvailableResultsRoute = () => {
    const { gameId, questionId } = this.props;
    const { ready } = this.state;

    const activeGameRef = game(gameId);
    const currentScreen = {
      route: `/lobby/${gameId}/questions/${questionId}/results`
    };
    if (ready) {
      activeGameRef.child("/currentScreen").set(currentScreen);
    }
  };

  constructNextStepRoute = () => {
    const { gameId, questionId } = this.props;
    const { ready } = this.state;

    const activeGameRef = game(gameId);
    const currentScreen = {
      route: `/games/${gameId}/questions/${questionId}/addAnswer`
    };
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
