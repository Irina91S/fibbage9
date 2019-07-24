import React, { Component } from 'react';
import { databaseRefs } from '../../../lib/refs';

import piechartSvg from '../../../shared/assets/svg/piechart.svg';

import './ScorePage.scss';

import { getToupleFromSnapshot } from '../../../lib/firebaseUtils';
import Animal from '../../../shared/Animal/Animal';
// import FloatBaloon from '../../../components/FloatBaloon/FloatBaloon';

const { game } = databaseRefs;

class ScorePage extends Component {
  gameRef = '';

  state = {
    players: []
  };

  componentDidMount() {
    const {
      match: {
        params: { gameId }
      }
    } = this.props;
    this.gameRef = game(gameId);

    this.gameRef.child('/currentScreen').on('value', snapshot => {
      const { history } = this.props;
      if (snapshot.val()) {
        const { route } = snapshot.val();
        history.push(route);
      }
    });

    this.gameRef.child('/players').on('value', snapshot => {
      if (snapshot.val()) {
        this.setState({
          players: getToupleFromSnapshot(snapshot.val())
        });
      }
    });
  }

  componentWillUnmount() {
    this.gameRef.off('value');
    this.gameRef.child('/currentScreen').off('value');
    this.gameRef.child('/players').off('value');
  }

  sortPlayersByScore = players =>
    players.sort((player1, player2) => player2.totalScore - player1.totalScore);

  getPlayersInfo = () => {
    const { players } = this.state;
    const playersData = players.map(player => {
      const [key, data] = player;
      return data;
    });
    return this.sortPlayersByScore(playersData);
  };

  getTeamAnimal = () => { };

  render() {
    return (
      <div className="partial-score-page">
        {/* <FloatBaloon style={{ top: '40%', right: '80%', width: '250px' }} className="up" /> */}
        <img src={piechartSvg} className="score-img" alt="piechart" />
        <div className="title">Scores so far</div>
        {this.getPlayersInfo().map((el, i) => (
          <div key={i} className="team-card">
            <Animal animal={el.animal.animal} className="animal-svg" />
            <div className="team-info">
              <div style={{ color: el.animal.color }} className="team-name">
                {el.nickname}
              </div>
              <div className="score">
                <span style={{ color: el.animal.color }}>{`${el.totalScore}  `}</span>
                points
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default ScorePage;
