import React, { Component } from "react";
import { databaseRefs } from "../../../lib/refs";
import { getToupleFromSnapshot } from "../../../lib/firebaseUtils";

class WaitPlayersPage extends Component {
  state = {
    limit: 0,
    players: [],
    currentScreen: ""
  };

  gameRef;
  playerRef;

  componentDidMount() {
    const {
      match: {
        params: { gameId }
      }
    } = this.props;
    const playerInfo = JSON.parse(localStorage.getItem("playerInfo"));
    const { playerId } = playerInfo;
    this.gameRef = databaseRefs.game(gameId);
    this.playerRef = databaseRefs.player(gameId, playerId);

    this.playerRef.child("/isReady").set(true);

    this.gameRef.on("value", snapshot => {
      const { players } = snapshot.val();
      this.setState({ players: getToupleFromSnapshot(players) });
    });

    this.gameRef.child("/currentScreen").on("value", snapshot => {
      const { history } = this.props;
      const { route } = snapshot.val();
      history.push(route);
    });

  }

  setPlayerNotReady = () => {
    const {
      match: {
        params: { gameId }
      }
    } = this.props;

    const playerInfo = JSON.parse(localStorage.getItem("playerInfo"));
    const { playerId } = playerInfo;
    this.playerRef = databaseRefs.player(gameId, playerId);
    this.playerRef.child("/isReady").set(false);
  };

  componentWillUnmount() {
    this.gameRef.off();
    // this.setPlayerNotReady();
  }

  renderListOfPlayersReady = () => {
    const { players } = this.state;
    return players.map(player => {
      const [key, data] = player;
      return (
        <li key={key}>
          <span>{data.nickname} - ready</span>
        </li>
      );
    });
  };

  render() {
    return <ul>{this.renderListOfPlayersReady()}</ul>;
  }
}

export default WaitPlayersPage;
