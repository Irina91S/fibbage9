import React, { Component } from 'react';
import { databaseRefs } from "../../../lib/refs";
import { getToupleFromSnapshot } from "../../../lib/firebaseUtils";

const { players, game } = databaseRefs;

class ScorePage extends Component {
  state = {
    players: [],
    sortedPlayers: []
  }; 

  playersRef = '';
  gameRef = '';

  getPlayersInfo = (players) => {
    return players.map(el => el[1]);
  }

  sortPlayersByScore = (players) => players.sort((player1, player2) => player2.totalScore - player1.totalScore);

  componentDidMount() {
    const {
      match: {
        params: { gameId }
      }
    } = this.props;

    this.playersRef = players(gameId);
    this.gameRef = game(gameId);

    this.playersRef.on("value", snapshot => {
      const playersSnapshot = snapshot.val();
      const playersInfo = this.getPlayersInfo(getToupleFromSnapshot(playersSnapshot));
      const sortedPlayers = this.sortPlayersByScore(playersInfo);
      this.setState({ players: playersInfo, sortedPlayers });
    });

    this.gameRef.child("/currentScreen").on("value", snapshot => {
      const { history } = this.props;
      if (snapshot.val()) {
        const { route } = snapshot.val();
        history.push(route);
      }
    });
  }

  componentWillUnmount() {
    this.gameRef.off("value");
    this.gameRef.child('/currentScreen').off();
  }

  render() {
    const { sortedPlayers } = this.state;
    return (
      <div>
      Scores so far:
        {sortedPlayers.map((player, index) => (
          <div key={`${player.nickname}${index}`}>
            <div>{player.nickname}</div>
            <div>{player.totalScore}</div>
          </div>
        ))}
      </div>
    )
  }
}

export default ScorePage;