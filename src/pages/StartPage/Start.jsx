import React, { Fragment } from 'react';
import { databaseRefs } from './../../lib/refs';
import { getToupleFromSnapshot } from './../../lib/firebaseUtils';

import InsertPincodeForm from './components/InsertPincodeForm';
import Moon from './components/Moon';

const { games } = databaseRefs;

class Start extends React.Component {
  state = {
    activeGames: []
  };

  getActiveGames = games => {
    return games
      .map(game => {
        const [key, gameData] = game;
        if (!gameData.isActive) return null;

        return game;
      })
      .filter(Boolean);
  };

  setActiveGames = games => {
    const activeGames = this.getActiveGames(games);
    console.log(activeGames);
    this.setState({ activeGames });
  };

  handleInsertPincode = ({ pincode }, actions) => {
    let gameToJoin;
    const { activeGames } = this.state;
    const pincodeMatchGame = activeGames
      .filter(game => {
        const [key, data] = game;

        if (data.pincode === pincode) {
          gameToJoin = key;
          return key;
        }

        return null;
      })
      .filter(Boolean);

    if (pincodeMatchGame.length === 1) {
      console.log(gameToJoin);
      this.redirectToGameLobby(gameToJoin);
    } else {
      actions.setFieldError('pincode', 'There is no active game with this pincode.');
    }
  };

  redirectToGameLobby = gameId => {
    const { history } = this.props;
    history.push(`/lobby/${gameId}/nickname`);
  };

  componentDidMount() {
    games.on('value', snapshot => {
      console.log(getToupleFromSnapshot(snapshot.val()));
      this.setActiveGames(getToupleFromSnapshot(snapshot.val()));
    });
  }

  componentWillUnmount() {
    this.games.off();
  }

  render() {
    return (
      <Fragment>
        <Moon top="30px" right="10px" />
        <Moon left="-50px" top="350px" />
        <InsertPincodeForm onSubmit={this.handleInsertPincode} />
      </Fragment>
    );
  }
}

export default Start;
