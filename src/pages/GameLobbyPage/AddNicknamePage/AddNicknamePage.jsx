import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { databaseRefs } from '../../../lib/refs';
import { getToupleFromSnapshot } from '../../../lib/firebaseUtils';

import svgImage from '../../../shared/assets/svg/good-team.svg';

import { Input, Footer } from '../../../shared';

class AddNickname extends Component {
  state = {
    error: false,
    playersLength: null,
    limit: 0,
    animals: [],
    players: []
  };

  gameRef;
  playersRef;
  playerRef;

  componentDidMount() {
    const {
      match: {
        params: { gameId }
      }
    } = this.props;
    this.gameRef = databaseRefs.game(gameId);
    this.gameRef.on('value', snapshot => {
      const { players, limit, animals } = snapshot.val();
      this.setState({
        animals: animals ? getToupleFromSnapshot(animals) : [],
        players: players ? getToupleFromSnapshot(players) : [],
        playersLength: players ? Object.values(players).length : 0,
        limit
      });
    });
  }

  componentWillUnmount() {
    if (this.gameRef) {
      this.gameRef.off();
    }

    if (this.playersRef) {
      this.playersRef.off();
    }

    if (this.playerRef) {
      this.playerRef.off();
    }
  }

  setNickname = async (newValues, actions) => {
    this.setState({ nickname: newValues.nickname });
    const {
      match: {
        params: { gameId }
      },
      history
    } = this.props;
    const { playersLength, limit } = this.state;
    this.playersRef = databaseRefs.players(gameId);

    if (!newValues.nickname || newValues.nickname.trim().length === 0) {
      actions.setFieldError(
        'nickname',
        'Lol, we actually thought of this, add a legit name'
      );

      return;
    }

    if (playersLength < limit) {
      if (this.nicknameAlreadySet(newValues.nickname)) {
        actions.setFieldError(
          'nickname',
          'Someone already took this nickname'
        );
        return;
      }

      this.playersRef.push(newValues).then(snap => {
        const playerId = snap.key;
        localStorage.setItem(
          'playerInfo',
          JSON.stringify({
            playerId,
            playerName: newValues.nickname
          })
        );

        const {
          match: {
            params: { gameId }
          }
        } = this.props;

        this.playerRef = databaseRefs.player(gameId, playerId);
        this.playerRef.on('value', snapshot => {
          if (snapshot.val().animal) {
            const playerInfo = JSON.parse(localStorage.getItem('playerInfo'));

            playerInfo.animal = { ...snapshot.val().animal };
            localStorage.setItem('playerInfo', JSON.stringify(playerInfo));
            const waitScreen = `/lobby/${gameId}/wait-players`;
            history.push(waitScreen);
          }
        });
      });
    } else {
      actions.setFieldError(
        'nickname',
        'Sorry, this game cannot afford any more players'
      );
    }
  };

  nicknameAlreadySet = nickname => {
    const { players } = this.state;
    return players
      .map(([key, data]) => {
        return data.nickname;
      })
      .includes(nickname);
  };

  render() {
    const { error } = this.state;

    return (
      <Formik
        initialValues={{
          nickname: '',
          totalScore: 0
        }}
        onSubmit={this.setNickname}
        render={({ values, handleSubmit, errors }) => (
          <Form>
            <label className="page-transition-elem">
              Choose a nickname for your team
            </label>
            <Input
              id="nickname"
              name="nickname"
              placeholder="NICKNAME"
              value={values.nickname}
              errors={errors}
            />
            {errors && <ErrorMessage component="span" name="nickname" />}
            <button onClick={handleSubmit} className="page-transition-elem">
              YEP, IT'S CRINGE ENOUGH
            </button>

            <footer className="page-transition-elem">
              Add a nickname for your team so we know what to display on the
              scoreboard. You want that 1st place, don't you? We know you do.
            </footer>

            <Footer>
              <img src={svgImage} className="footer-image" />
            </Footer>
          </Form>
        )}
      />
    );
  }
}

export default withRouter(AddNickname);
