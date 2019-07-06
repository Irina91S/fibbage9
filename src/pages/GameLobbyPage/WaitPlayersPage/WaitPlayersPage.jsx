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

  componentDidMount() {
    const {
      match: {
        params: { gameId }
      }
    } = this.props;
    this.gameRef = databaseRefs.game(gameId);

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

  componentWillUnmount() {
    this.gameRef.off();
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
