import React, { Component, Fragment } from "react";
import anime from "animejs";
import { databaseRefs } from "../../../lib/refs";
import { getToupleFromSnapshot } from "../../../lib/firebaseUtils";
import Animal from "../../../shared/Animal/Animal";
import Card from "../../../shared/Card/Card";

import FirstPlaceCrown from "../../../shared/assets/svg/first-place.svg";
import SecondPlaceCrown from "../../../shared/assets/svg/second-place.svg";

import "./TotalScoresPage.scss";

const { players } = databaseRefs;

const dimensions = { height: 72, width: 72 };

class TotalScorePage extends Component {
  state = {
    players: [],
    sortedPlayers: []
  };

  shouldTemperScore = (player, playerToTemperAgainst) => {
    if (player.totalScore === playerToTemperAgainst.totalScore) {
      return true;
    }

    return false;
  };

  getPlayersInfo = players => {
    return players.map(el => el[1]);
  };

  sortPlayersByScore = players =>
    players.sort((player1, player2) => player2.totalScore - player1.totalScore);

  renderListOfPlayers = () => {
    const { players } = this.state;
    const playerInfo = JSON.parse(localStorage.getItem("playerInfo"));
    const { playerName } = playerInfo;

    if (!players || players.length === 0) {
      return [];
    }

    return players
      .sort((player1, player2) => player2.totalScore - player1.totalScore)
      .map((player, index) => {
        const isCurrentPlayer = playerName === player.nickname;
        const color = player.animal ? player.animal.color : "";
        let score = player.totalScore;

        if (index === 1) {
          if (this.shouldTemperScore(player, player[0])) {
            score -= 10;
          }
        }

        if (index === 2) {
          if (this.shouldTemperScore(player, player[1])) {
            score -= 10;
          }
        }

        const style = {
          color: color
        };

        return (
          <Fragment key={player.animal.animal}>
            {index <= 1 && (
              <div className="winner o-layout--center o-layout--stretch u-1/1">
                {index === 0 && <img src={FirstPlaceCrown} alt="first-place" />}
                {index === 1 && (
                  <img src={SecondPlaceCrown} alt="second-place" />
                )}

                <Card
                  hasBg={isCurrentPlayer}
                  className="u-1/1 u-margin-bottom-small u-1/1 u-weight-bold card cancer"
                  style={style}
                >
                  <div className="card--left">
                    <div className="u-h4 u-margin-bottom-small">
                      {player.nickname}
                    </div>
                    <div className="u-h5">SCORE: {score}</div>
                  </div>

                  <div className="card--right">
                    <Animal
                      className="u-margin-right-small"
                      style={dimensions}
                      animal={player.animal.animal}
                    />
                  </div>
                </Card>

                {index === 1 && (
                  <h1 className="u-h4 u-margin-top-small u-color-main">
                    Better luck next time
                  </h1>
                )}
              </div>
            )}
            {index > 1 && (
              <div className="grid-item loser">
                <Card
                  hasBg={isCurrentPlayer}
                  className="u-1/1 u-margin-bottom-small cancer-container"
                  style={{ ...style, padding: "6px" }}
                >
                  <div className="u-h6 u-margin-bottom-small">
                    {player.nickname}
                  </div>

                  <Animal
                    className="u-margin-bottom-small"
                    style={dimensions}
                    animal={player.animal.animal}
                  />

                  <div className="u-h5">SCORE: {player.totalScore}</div>
                </Card>
              </div>
            )}
          </Fragment>
        );
      });
  };

  redirectToHomePage = () => {
    const { history } = this.props;
    history.push("/");
  };

  componentDidMount() {
    const {
      match: {
        params: { gameId }
      }
    } = this.props;
    const playersRef = players(gameId);

    playersRef.on("value", snapshot => {
      const playersSnapshot = snapshot.val();
      const playersInfo = this.getPlayersInfo(
        getToupleFromSnapshot(playersSnapshot)
      );
      const sortedPlayers = this.sortPlayersByScore(playersInfo);
      this.setState({ players: playersInfo, sortedPlayers }, () => {
        anime({
          targets: ".winner",
          translateX: [-100, 0],
          opacity: [0, 1],
          delay: anime.stagger(100),
          easing: "easeInOutQuint",
          duration: 800
        });

        anime({
          display: "inline-flex",
          targets: ".loser",
          translateY: [30, 0],
          opacity: [0, 1],
          delay: anime.stagger(100),
          easing: "easeInOutQuint",
          duration: 800
        });
      });
    });
  }

  componentWillUnmount() {
    if (this.playersRef) {
      this.playersRef.off();
    }
  }

  render() {
    const { sortedPlayers } = this.state;
    return (
      <div>
        <button onClick={this.redirectToHomePage}>Back Home</button>
        {this.renderListOfPlayers()}
      </div>
    );
  }
}

export default TotalScorePage;
