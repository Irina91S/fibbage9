import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { databaseRefs } from '../../../lib/refs';
import { getToupleFromSnapshot } from '../../../lib/firebaseUtils';

class AddNickname extends Component {
  state = {
    error: false,
    playersLength: null,
    limit: 0,
    players: []
  }
  componentDidMount() {
    const { match: { params: { gameId } } } = this.props;
    const gameRef = databaseRefs.game(gameId);
    gameRef.on('value', (snapshot) => {
      const { players, limit } = snapshot.val();
      this.setState({ 
        players: getToupleFromSnapshot(players),
        playersLength: players ? Object.values(players).length : 0,
        limit
      });
    })
  }

  componentWillUnmount() {
    const { match: { params: { gameId } } } = this.props;
    const gameRef = databaseRefs.game(gameId);
    gameRef.off();
  }

  setNickname = (newValues, actions) => {
    this.setState({ nickname: newValues.nickname });
    const { match: { params: { gameId } }, history } = this.props;
    const { playersLength, limit } = this.state;
    const playersRef = databaseRefs.players(gameId);

    if (!newValues.nickname || newValues.nickname.trim().length === 0) {
      actions.setFieldError('nickname', 'Lol, we actually thought of this, add a legit name');
      return;
    }

    if (playersLength < limit) {

      if (this.nicknameAlreadySet(newValues.nickname)) {
        actions.setFieldError('nickname', 'Someone already took your nickname, pick something else');
        return;
      }

      playersRef.push(newValues).then(snap => {
        const playerId = snap.key;
        localStorage.setItem('playerInfo', JSON.stringify({
          playerId,
          playerName: newValues.nickname
        }));
        history.push(`/lobby/${gameId}/wait-players`);
      });
    } else {
      this.setState({ error: true })
    }
  }

  nicknameAlreadySet = (nickname) => {
    const { players } = this.state;
    return players
      .map(([key, data]) => {
        return data.nickname;
      })
      .includes(nickname);
  };

  render() {
    const { error } = this.state;
    return error ? (<div>S-a depasit limita de participanti pentru acest joc</div>) : (
      <Formik
        initialValues={{
          nickname: '',
          totalScore: 0
        }}
        onSubmit={this.setNickname}
        render={({ values, handleSubmit }) => (
          <Form>
            <Field
              id="nickname"
              name="nickname"
              placeholder="nickname"
              value={values.nickname}
            />
            <ErrorMessage name="nickname" />
            <button onClick={handleSubmit}>Next</button>
          </Form>
        )}
      />
    );
  }
};

export default withRouter(AddNickname);