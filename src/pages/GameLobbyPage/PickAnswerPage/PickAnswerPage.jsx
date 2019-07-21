import React, { Fragment, Component } from 'react';
import anime from 'animejs';
import { databaseRefs } from '../../../lib/refs';
import { getToupleFromSnapshot } from '../../../lib/firebaseUtils';

import './PickAnswerPage.scss';

import { useCurrentPlayer } from '../../../hooks';
import WaitingScreen from '../WaitingScreen/WaitingScreen';
import { Card } from '../../../shared';
const { lobby } = databaseRefs;

class PickAnswerPage extends Component {
  state = {
    allAnswers: [],
    disabled: false,
    isSubmitted: false
  };

  setAnswer = (
    gameId,
    questionId,
    fakeAnswerId,
    playerId,
    playerName,
    animal
  ) => {
    this.setState({ disabled: true });
    const lobbyRef = lobby(gameId, questionId);
    lobbyRef
      .child('/fakeAnswers')
      .child(fakeAnswerId)
      .child('/votedBy')
      .child(playerId)
      .set(playerName);

    lobbyRef
      .child("/fakeAnswers")
      .child(fakeAnswerId)
      .child("/votedBy")
      .child(playerId)
      .child("/animal")
      .set(animal);
  };


  setCorrectAnswer = async (gameId, questionId, playerId, playerName, animal) => {
    this.setState({ disabled: true });
    const lobbyRef = lobby(gameId, questionId);
    lobbyRef
      .child('/answer')
      .child('/votedBy')
      .child(playerId)
      .child('/name')
      .set(playerName);

    lobbyRef
      .child("/answer")
      .child("/votedBy")
      .child(playerId)
      .child("/animal")
      .set(animal);
  };

  selectCorrectAnswer = () => {
    this.setState({ isSubmitted: true });

    const playerInfo = JSON.parse(localStorage.getItem("playerInfo"));

    const {
      playerId,
      playerName,
      animal: { animal }
    } = playerInfo;

    const {
      match: {
        params: { gameId, questionId }
      }
    } = this.props;


    this.setCorrectAnswer(gameId, questionId, playerId, playerName, animal);
  };

  selectAnswer = fakeAnswerId => {
    this.setState({ isSubmitted: true });

    const playerInfo = JSON.parse(localStorage.getItem("playerInfo"));
    const {
      playerId,
      playerName,
      animal: { animal }
    } = playerInfo;


    const {
      match: {
        params: { gameId, questionId }
      }
    } = this.props;

    this.setAnswer(
      gameId,
      questionId,
      fakeAnswerId,
      playerId,
      playerName,
      animal
    );
  };

  componentDidMount() {
    const {
      match: {
        params: { gameId, questionId }
      }
    } = this.props;
    const lobbyRef = lobby(gameId, questionId);

    lobbyRef.on('value', snapshot => {
      const givenAnswers = snapshot.val().fakeAnswers;

      const correctAnswer = snapshot.val().answer;
      if (givenAnswers) {
        this.setState(
          {
            allAnswers: this.shuffleAnswers(
              getToupleFromSnapshot(givenAnswers),
              correctAnswer
            )
          },
          () => {
            anime({
              targets: '.answer.anime',
              translateX: [-1000, 0],
              opacity: [0, 1],
              delay: anime.stagger(100),
              easing: 'easeInOutQuint',
              duration: 400
            });
          }
        );
      }
    });
  }

  shuffleAnswers = (fakeAnswers, truth) => {
    const currentPlayer = useCurrentPlayer();
    fakeAnswers = fakeAnswers.filter(
      answer => answer[1].authorTeam !== currentPlayer.playerId
    );

    const allAnswers = [...fakeAnswers, truth];

    const sorted = allAnswers.sort((a, b) => {
      const firstValue = a.value ? a.value.toLowerCase() : a[1].value;
      const secondValue = b.value ? b.value.toLowerCase() : b[1].value;

      if (firstValue < secondValue) {
        return -1;
      } else if (firstValue > secondValue) {
        return 1;
      }
      return 0;
    });
    return sorted;
  };

  onAnswerClick = (index, callback) => {
    const { allAnswers } = this.state;

    if (allAnswers[index].selected) {
      callback();
      return;
    }

    allAnswers.forEach((answer, i) => (answer.selected = i == index));
    this.setState({ allAnswers });
  };


  render() {
    const { allAnswers, isSubmitted } = this.state;

    return (
      <div className="pick-answer u-weight-bold">
        {allAnswers.map((answer, i) => {
          const correct = !!answer.value;
          const value = correct ? answer.value : answer[1].value;

          return (
            <Fragment key={i}>
              {answer.selected && (
                <div className="tooltip u-margin-left-large u-padding-left-small">
                  Selected
                </div>
              )}
              <div
                className="answer anime o-layout--stretch u-margin-bottom-small"
                key={answer}
              >
                <Card
                  type={answer.selected ? 'success' : 'basic'}
                  className="o-layout__item counter u-margin-right-small"
                >
                  {i + 1}.
                </Card>
                <Card
                  type={answer.selected ? 'success' : 'basic'}
                  className="o-layout__item value"
                  onClick={() =>
                    correct
                      ? this.onAnswerClick(i, this.selectCorrectAnswer)
                      : this.onAnswerClick(i, () =>
                          this.selectAnswer(answer[0])
                        )
                  }
                >
                  {value}
                </Card>
              </div>
            </Fragment>
          );
        })}
        {isSubmitted && <WaitingScreen />}
      </div>
    );
  }
}

export default PickAnswerPage;
