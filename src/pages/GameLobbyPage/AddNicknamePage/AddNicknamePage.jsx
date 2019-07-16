import React, { Component } from "react";
import { withRouter } from "react-router";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { databaseRefs } from "../../../lib/refs";
import { getToupleFromSnapshot } from "../../../lib/firebaseUtils";

class AddNickname extends Component {
  state = {
    error: false,
    playersLength: null,
    limit: 0,
    players: []
  };

  gameRef;
  playersRef;

  componentDidMount() {
    const {
      match: {
        params: { gameId }
      }
    } = this.props;
    this.gameRef = databaseRefs.game(gameId);
    this.gameRef.on("value", snapshot => {
      const { players, limit } = snapshot.val();
      this.setState({
        players: players ? getToupleFromSnapshot(players) : [],
        playersLength: players ? Object.values(players).length : 0,
        limit
      });
    });
  }

  componentWillUnmount() {
    this.gameRef.off();
    this.playersRef.off();
  }

  setNickname = (newValues, actions) => {
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
        "nickname",
        "Lol, we actually thought of this, add a legit name"
      );
      return;
    }

    if (playersLength < limit) {
      if (this.nicknameAlreadySet(newValues.nickname)) {
        actions.setFieldError(
          "nickname",
          "Someone already took your nickname, pick something else"
        );
        return;
      }
      const gameRef = this.gameRef;

      this.playersRef.push(newValues).then(snap => {
        const playerId = snap.key;
        localStorage.setItem(
          "playerInfo",
          JSON.stringify({
            playerId,
            playerName: newValues.nickname
          })
        );

        const waitScreen = `/lobby/${gameId}/wait-players`
        history.push(waitScreen);
      });
    } else {
      this.setState({ error: true });
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
    return error ? (
      <div>S-a depasit limita de participanti pentru acest joc</div>
    ) : (
      <Formik
        initialValues={{
          nickname: "",
          totalScore: 0
        }}
        onSubmit={this.setNickname}
        render={({ values, handleSubmit }) => (
          <Form>
            <label>Choose a nickname for your team</label>
            <Field
              id="nickname"
              name="nickname"
              placeholder="NICKNAME"
              value={values.nickname}
            />
            <ErrorMessage name="nickname" />
            <button onClick={handleSubmit}>YEP, IT'S CRINGE ENOUGH</button>

            <footer>Add a nickname for your team so we know what to display on the scoreboard. 
              You want that 1st place, don't you? We know you do.</footer>
          </Form>
        )}
      />
    );
  }
}

export default withRouter(AddNickname);
