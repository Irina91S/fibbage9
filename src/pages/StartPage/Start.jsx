import React from 'react';
import { databaseRefs } from './../../lib/refs';
import { getToupleFromSnapshot } from './../../lib/firebaseUtils';
import InsertPincodeForm from './Start/InsertPincodeForm';

const { games } = databaseRefs;

class Start extends React.Component {
  state = {
    activeGames: []
  }

  getActiveGames = (games) => {
    return games
      .map(game => {
        const [key, gameData] = game;
        if (!gameData.isActive) return null;

        return game;
      })
      .filter(Boolean);
  }

  setActiveGames = (games) => {
    const activeGames = this.getActiveGames(games);
    console.log(activeGames);
    this.setState({ activeGames });
  };

  handleInsertPincode = ({ pincode }, actions) => {
    const { activeGames } = this.state;
    const pincodeMatchGame = activeGames
      .filter(game => {
        const [key, data] = game;

        if (data.pincode === pincode) {
          return key
        }

        return null
      })
      .filter(Boolean);

    if (pincodeMatchGame.length === 1) {
      console.log('redirect to game lobby');
    } else {
      actions.setFieldError('pincode', 'another one')
    }
  };

  componentDidMount() {
    games.on('value', (snapshot) => {
      console.log(getToupleFromSnapshot(snapshot.val()));
      this.setActiveGames(getToupleFromSnapshot(snapshot.val()));
    });
  };

  render() {
    return <InsertPincodeForm onSubmit={this.handleInsertPincode} />
  }
}

export default Start;
