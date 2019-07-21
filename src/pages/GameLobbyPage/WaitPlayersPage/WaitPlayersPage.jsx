import React, { Component, Fragment } from "react";
import { databaseRefs } from "../../../lib/refs";
import { getToupleFromSnapshot } from "../../../lib/firebaseUtils";

import "./WaitPlayersPage.scss";

import { Card, Animal } from "../../../shared";

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

    this.gameRef.on("value", snapshot => {
      const { players, limit } = snapshot.val();

      this.setState({
        players: getToupleFromSnapshot(players),
        limit
      });
    });

    this.gameRef.child("/currentScreen").on("value", snapshot => {
      const { history } = this.props;
      if (snapshot.val()) {
        const { route } = snapshot.val();
        history.push(route);
      }
    });
  }

  componentDidUpdate() {
    console.log("update", this.state);
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
      const [key, data] = player;
      const style = { color: data.animal.color };
      return (
        <div key={key} className="team  u-padding-small u-margin-bottom-small">
          <div className="o-layout--flex">
            <Animal
              className="u-margin-right-small"
              animal={data.animal.animal}
            />
            <Card
              className="player u-margin-vertical-small u-weight-bold u-2/3"
              style={style}
            >
              {data.nickname}
            </Card>
          </div>
        </div>
      );
    });
  };

  renderListOfReadyAnimals = () => {
    const { players } = this.state;
    return players.map(player => {
      const [key, data] = player;
      return (
        <Animal
          key={key}
          className="u-margin-right-small"
          animal={data.animal.animal}
        />
      );
    });
  };

  render() {
    const { limit, players } = this.state;

    return (
      <Fragment>
        <div>
          <h3>Waiting for all teams</h3>
          <div className="o-layout--flex">
            {`${players.length}/${limit} Teams are ready`}{" "}
            {this.renderListOfReadyAnimals()}
          </div>
        </div>
        {this.renderListOfPlayersReady()}
      </Fragment>
    );
  }
}

export default WaitPlayersPage;
