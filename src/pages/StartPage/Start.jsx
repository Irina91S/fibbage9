import React, { Fragment } from 'react';
import anime from 'animejs';
import { databaseRefs } from './../../lib/refs';
import { getToupleFromSnapshot } from './../../lib/firebaseUtils';
import { InsertPincodeForm, Rocket, Moon } from './components';

const { games } = databaseRefs;

class Start extends React.Component {
  state = {
    activeGames: [],
    rocketActive: false
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
    this.setState({ activeGames });
  };

  handleInsertPincode = ({ pincode }, actions) => {
    let gameToJoin;
    const { activeGames } = this.state;

    if (!pincode || pincode.toString().trim().length === 0) {
      actions.setFieldError('pincode', () => <span>Really?... &#x1F611;&#x1F611; </span>);

      return;
    }

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
      this.setState({ rocketActive: true });

      anime({
        targets: ['form', '.moon'],
        opacity: [1, 0],
        duration: 7000
      });

      setTimeout(() => {
        this.redirectToGameLobby(gameToJoin);
      }, 1000);
    } else {
      actions.setFieldError('pincode', () => (
        <span>There is no active game with this pincode.</span>
      ));
    }
  };

  redirectToGameLobby = gameId => {
    const { history } = this.props;
    history.push(`/lobby/${gameId}/nickname`);
  };

  componentDidMount() {
    games.on('value', snapshot => {
      this.setActiveGames(getToupleFromSnapshot(snapshot.val()));
    });
  }

  componentWillUnmount() {
    games.off();
  }

  render() {
    return (
      <Fragment>
        <Rocket active={this.state.rocketActive} />
        <Moon top="30px" right="10px" />
        <Moon left="-50px" top="350px" />
        <InsertPincodeForm onSubmit={this.handleInsertPincode} />
      </Fragment>
    );
  }
}

export default Start;
