import React, { Component } from 'react';
import { databaseRefs } from "../../../lib/refs";
import { getToupleFromSnapshot } from "../../../lib/firebaseUtils";

const { players } = databaseRefs;

class TotalScorePage extends Component {
  state = {
    players: [],
    sortedPlayers: []
  }; 

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
    const playersRef = players(gameId);

    playersRef.on("value", snapshot => {
      const playersSnapshot = snapshot.val();
      const playersInfo = this.getPlayersInfo(getToupleFromSnapshot(playersSnapshot));
      const sortedPlayers = this.sortPlayersByScore(playersInfo);
      this.setState({ players: playersInfo, sortedPlayers });
    });
  }

  render() {
    const { sortedPlayers } = this.state;
    return (
      <div>
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

export default TotalScorePage;