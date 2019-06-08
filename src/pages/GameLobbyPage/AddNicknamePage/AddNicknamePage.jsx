import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { databaseRefs } from '../../../lib/refs';
class AddNickname extends Component {
    state = {
        error: false,
        playersLength: null,
        limit: 0,
        players: []
    }
    componentDidMount() {
        const { match: { params: { gameId } } } = this.props;
        const  gameRef = databaseRefs.game(gameId);
        gameRef.on('value', (snapshot) => {
            const { players, limit } = snapshot.val();
            this.setState({ playersLength: players ? Object.values(players).length : 0, limit });
        })
    }

    componentWillUnmount() {
        const { match: { params: { gameId } } } = this.props;
        const  gameRef = databaseRefs.game(gameId);
        gameRef.off();
    }

    setNickname = (newValues) => {
        this.setState({ nickname: newValues.nickname });
        const { match: { params: { gameId } } } = this.props;
        const { playersLength, limit } = this.state;
        const playersRef = databaseRefs.players(gameId);
        if (playersLength < limit) {
            playersRef.push(newValues).then(snap => {
                const playerId = snap.key;
                localStorage.setItem('playerId', playerId);
            });
        } else {
            this.setState({ error: true })
        }
        
    }

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
                    <ErrorMessage name="nickname"/>
                    <button onClick={handleSubmit}>Next</button>
                </Form>
            )}
            />
        );
    }
};

export default withRouter(AddNickname);