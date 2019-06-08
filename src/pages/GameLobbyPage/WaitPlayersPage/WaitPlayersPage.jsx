import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { databaseRefs } from '../../../lib/refs';
import { getToupleFromSnapshot } from '../../../lib/firebaseUtils';

class WaitPlayersPage extends Component {
  state = {
    limit: 0,
    players: []
  }

  gameRef;

  componentDidMount() {
    const { match: { params: { gameId } } } = this.props;
    this.gameRef = databaseRefs.game(gameId);
    this.gameRef.on('value', (snapshot) => {
      const { players } = snapshot.val();
      console.log(getToupleFromSnapshot(players));
      this.setState({players: getToupleFromSnapshot(players)});
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
    return (
      <ul>
        {this.renderListOfPlayersReady()}
      </ul>
    )
  };
}

export default WaitPlayersPage;