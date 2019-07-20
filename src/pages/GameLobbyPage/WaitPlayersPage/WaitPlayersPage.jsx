import React, { Component } from 'react';
import { databaseRefs } from '../../../lib/refs';
import { getToupleFromSnapshot } from '../../../lib/firebaseUtils';

import './WaitPlayersPage.scss';

import { Card, Animal } from '../../../shared';

class WaitPlayersPage extends Component {
  state = {
    limit: 0,
    players: [],
    currentScreen: ''
  };

  gameRef;
  playerRef;

  componentDidMount() {
    const {
      match: {
        params: { gameId }
      }
    } = this.props;
    const playerInfo = JSON.parse(localStorage.getItem('playerInfo'));
    const { playerId } = playerInfo;
    this.gameRef = databaseRefs.game(gameId);
    this.playerRef = databaseRefs.player(gameId, playerId);

    this.playerRef.child('/isReady').set(true);

    this.gameRef.on('value', snapshot => {
      const { players } = snapshot.val();
      this.setState({ players: getToupleFromSnapshot(players) });
    });

    this.gameRef.child('/currentScreen').on('value', snapshot => {
      const { history } = this.props;
      if (snapshot.val()) {
        const { route } = snapshot.val();
        history.push(route);
      }
    });
  }

  componentDidUpdate() {
    console.log('update', this.state);
  }

  setPlayerNotReady = () => {
    const {
      match: {
        params: { gameId }
      }
    } = this.props;

    const playerInfo = JSON.parse(localStorage.getItem('playerInfo'));
    const { playerId } = playerInfo;
    this.playerRef = databaseRefs.player(gameId, playerId);
    this.playerRef.child('/isReady').set(false);
  };

  componentWillUnmount() {
    this.gameRef.off();
    this.setPlayerNotReady();
  }

  renderListOfPlayersReady = () => {
    const { players } = this.state;
    return players.map(player => {
      const [key, data] = player;
      return (
        <div
          key={key}
          className="team o-layout--stretch u-padding-small u-margin-bottom-small"
        >
          <Animal className="u-margin-right-small" />
          <Card className="player u-margin-vertical-small u-weight-bold u-2/3">
            {data.isReady ? (
              data.nickname
            ) : (
              <span className="waiting">Loading...</span>
            )}
          </Card>
        </div>
      );
    });
  };

  render() {
    return this.renderListOfPlayersReady();
  }
}

export default WaitPlayersPage;
