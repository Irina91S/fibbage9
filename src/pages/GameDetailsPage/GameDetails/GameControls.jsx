/* eslint-disable react-hooks/rules-of-hooks */
import React, { Fragment, Component } from "react";
import { databaseRefs } from "../../../lib/refs";
import { getToupleFromSnapshot } from "../../../lib/firebaseUtils";


const { game } = databaseRefs;

class gameControls extends Component {

  componentDidMount() {
    const { gameId } = this.props;
    const activeGameRef = game(gameId);
    activeGameRef.on("value", snapshot => {
      const currentGame = snapshot.val();
      getToupleFromSnapshot(currentGame);
    });
  }

  constructAvailableAnswerRoute = () => {
    const { gameId, questionId } = this.props;
    const activeGameRef = game(gameId);
    const currentScreen = {
      route: `/lobby/${gameId}/${questionId}/pick-answer`
    };
    activeGameRef
      .child("/currentScreen")
      .set(currentScreen);
  };

  constructAvailableResultsRoute = () => {
    const { gameId, questionId } = this.props;
    const activeGameRef = game(gameId);
    const currentScreen = {
      route: `/lobby/${gameId}/questions/${questionId}/results`
    };
    activeGameRef
      .child("/currentScreen")
      .set(currentScreen);
  };

  constructNextStepRoute = () => {
    const { gameId, questionId } = this.props;
    const activeGameRef = game(gameId);
    const currentScreen = {
      route: `/games/${gameId}/questions/${questionId}/addAnswer`
    };
    activeGameRef
      .child("/currentScreen")
      .set(currentScreen);
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
        <button onClick={this.constructNextStepRoute}>Next</button>
      </Fragment>
    );
  }
}

export default gameControls;
