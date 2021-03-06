import React, { Component, Fragment } from 'react';
import anime from 'animejs';
import { databaseRefs } from '../../../lib/refs';
import { getToupleFromSnapshot } from '../../../lib/firebaseUtils';

import './WaitPlayersPage.scss';

import { Card, Animal } from '../../../shared';

const dimensions = { height: 72, width: 72 };

class WaitPlayersPage extends Component {
  state = {
    limit: 0,
    players: [],
    currentScreen: '',
    animated: false
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
      const { players, limit } = snapshot.val();

      this.setState(
        {
          players: getToupleFromSnapshot(players),
          limit
        },
        () => {
          if (!this.state.animated) {
            anime({
              targets: '.team',
              translateX: [-1000, 0],
              opacity: [0, 1],
              delay: anime.stagger(100),
              easing: 'easeInOutQuint',
              duration: 400
            });

            this.setState({ animated: true });
          }
        }
      );
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
      this.gameRef.child('/currentScreen').off();
    }

    this.setPlayerNotReady();
  }

  renderMiniAnimals = () => {
    const { players, limit } = this.state;

    return players.map((player, i) => {
      const [key, data] = player;
      const color = data.animal ? data.animal.color : '';

      if (!data.animal) return null;

      return (
        <Animal
          className="mini"
          style={{ width: 15, height: 15, color: data.animal.color, zIndex: limit - i }}
          animal={data.animal.animal}
        />
      );
    });
  };

  renderListOfPlayersReady = () => {
    const playerInfo = JSON.parse(localStorage.getItem('playerInfo'));
    const { players } = this.state;

    if (!players || players.length === 0) {
      return [];
    }
    const playerIndex = players.findIndex(player => player[0] === playerInfo.playerId);
    const playerDetails = [...players[playerIndex]];

    players.splice(playerIndex, 1);
    players.unshift(playerDetails);

    return players.map(player => {
      const [key, data] = player;
      const isCurrentPlayer = playerInfo.playerId === key;
      const color = data.animal ? data.animal.color : '';

      const style = {
        color: color
      };
      return (
        <div key={key} className="team o-layout--stretch u-padding-small u-margin-bottom-small">
          {data.animal && (
            <Animal
              className="u-margin-right-small"
              style={dimensions}
              animal={data.animal.animal}
            />
          )}
          <Card className="player u-margin-vertical-small u-weight-bold u-2/3" style={style}>
            {data.nickname}
          </Card>
          {isCurrentPlayer && (
            <div className="bg" style={{ backgroundColor: color, opacity: 0.5 }} />
          )}
        </div>
      );
    });
  };

  renderRemainingPlayers = amount => {
    return Array.from('0'.repeat(amount)).map((_, i) => {
      return (
        <div key={i} className="team o-layout--stretch u-padding-small u-margin-bottom-small">
          <div
            className="u-margin-right-small"
            style={{ ...dimensions, opacity: 0.2, background: 'gray', border: '1px solid #335079' }}
          />

          <Card
            className="player u-margin-vertical-small u-weight-bold u-2/3"
            style={{ opacity: 0.4 }}
          >
            Not yet... <span role="img" aria-label="emojis">&#128542;&#128542;</span>
          </Card>
        </div>
      );
    });
  };

  render() {
    const { limit, players } = this.state;

    return (
      <Fragment>
        <div className="wait-players">
          <h5>
            {players.length}/{limit} teams ready {this.renderMiniAnimals()}
          </h5>
        </div>
        {this.renderListOfPlayersReady(limit)}
        {this.renderRemainingPlayers(limit - players.length)}
      </Fragment>
    );
  }
}

export default WaitPlayersPage;
