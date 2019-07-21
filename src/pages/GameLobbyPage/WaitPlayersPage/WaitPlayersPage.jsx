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

  setPlayerNotReady = () => {
    const {
      match: {
        params: { gameId }
      }
    } = this.props;

    const playerInfo = JSON.parse(localStorage.getItem('playerInfo'));
    const { playerId } = playerInfo;
    this.playerRef = databaseRefs.player(gameId, playerId);
  };

  componentWillUnmount() {
    if (this.gameRef) {
      this.gameRef.off();
    }

    this.setPlayerNotReady();
  }

  renderListOfPlayersReady = () => {
    const { players } = this.state;
    return players.map(player => {
      console.log(player);
      const [key, data] = player;
      const style = { color: data.animal ? data.animal.color : '' };
      return (
        <div
          key={key}
          className="team o-layout--stretch u-padding-small u-margin-bottom-small"
        >
          {data.animal && <Animal className="u-margin-right-small" style={{height: 72, width: 72}} animal={data.animal.animal}/>}
          <Card
            className="player u-margin-vertical-small u-weight-bold u-2/3"
            style={style}
          >
            {data.nickname}
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
