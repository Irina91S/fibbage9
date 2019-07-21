import React, { Fragment, Component } from "react";
import anime from "animejs";
import { databaseRefs } from "../../../lib/refs";
import { getToupleFromSnapshot } from "../../../lib/firebaseUtils";
import { useCurrentPlayer } from '../../../hooks';
import { Card, Timer } from '../../../shared';
import NumberCircle from '../../../shared/assets/svg/number-circle.svg';
import "./PickAnswerPage.scss";
const { lobby, game } = databaseRefs;

class PickAnswerPage extends Component {
  gameRef;
  currentScreenRef;
  lobbyRef;

  state = {
    allAnswers: [],
    disabled: false,
    isSubmitted: false,
    timerEndDate: '',
    animated: false,
  };

  setAnswer = (
    fakeAnswerId,
    playerId,
    playerName,
    animal
  ) => {
    this.setState({ disabled: true });

    this.lobbyRef
      .child('/fakeAnswers')
      .child(fakeAnswerId)
      .child("/votedBy")
      .child(playerId)
      .set(playerName);

    this.lobbyRef
      .child("/fakeAnswers")
      .child(fakeAnswerId)
      .child("/votedBy")
      .child(playerId)
      .child("/animal")
      .set(animal);
  };


  setCorrectAnswer = async (playerId, playerName, animal) => {
    this.setState({ disabled: true });

    this.lobbyRef
      .child('/answer')
      .child('/votedBy')
      .child(playerId)
      .child('/name')
      .set(playerName);

    this.lobbyRef
      .child("/answer")
      .child("/votedBy")
      .child(playerId)
      .child("/animal")
      .set(animal);
  };

  selectCorrectAnswer = () => {
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
    const playerInfo = JSON.parse(localStorage.getItem("playerInfo"));
    const {
      playerId,
      playerName,
      animal: { animal }
    } = playerInfo;

    this.setAnswer(
      fakeAnswerId,
      playerId,
      playerName,
      animal
    );
  };

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
    this.setState({ isSubmitted: true });
    const { allAnswers } = this.state;

    callback();

    allAnswers.forEach((answer, i) => (answer.selected = i == index));
    this.setState({ allAnswers });
  };

  componentDidMount() {

    const {
      match: {
        params: { gameId, questionId }
      }
    } = this.props;

    this.gameRef = game(gameId);
    this.lobbyRef = lobby(gameId, questionId);
    this.currentScreenRef = this.gameRef.child('/currentScreen/route');

    this.currentScreenRef.on('value', snapshot => {
      const { history } = this.props;
      if (snapshot.val()) {
        history.push(snapshot.val());
      }
    });

    this.gameRef
      .child('/timer/endTime')
      .on('value', snapshot => this.setState({ timerEndDate: snapshot.val() }))

    this.lobbyRef.on('value', snapshot => {
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
            if (this.state.animated) {
              return;
            }

            anime({
              targets: ".answer.anime",
              translateX: [-1000, 0],
              opacity: [0, 1],
              delay: anime.stagger(100),
              easing: "easeInOutCirc",
              duration: 400,
              complete: () => {
                this.setState({animated: true})
                anime({
                  targets: '.float-from-bottom',
                  translateY: [-3, 3],
                  direction: 'alternate',
                  easing: 'easeInOutCirc',
                  duration: 3000,
                  loop: true
                });

                anime({
                  targets: '.float-from-top',
                  translateY: [3, -3],
                  direction: 'alternate',
                  easing: 'easeInOutCirc',
                  duration: 3000,
                  loop: true
                })
              }
            });
          }
        );
      }
    });
  }

  componentWillUnmount() {
    if (this.gameRef) {
      this.gameRef.off();
      this.gameRef.child('/timer/endTime').off();
    }

    if (this.lobbyRef) {
      this.lobbyRef.off();
    }
  }

  render() {
    const { allAnswers, isSubmitted, timerEndDate } = this.state;
    console.log(isSubmitted);

    return (
      <div className="pick-answer u-weight-bold">
        {timerEndDate &&
          <Timer
            endTime={timerEndDate}
            onTimerEnd={() => this.setState({ isSubmitted: false })}
          />
        }
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
                  type={answer.selected ? "success" : "basic"}
                  className="o-layout__item counter u-margin-right-small"
                  disabled={isSubmitted && !answer.selected}
                >
                  <div className="decoration-wrapper">
                    {!answer.selected && <img className={`decoration-wrapper__decoration ${Math.floor(2 * Math.random()) === 1 ? 'float-from-bottom' : 'float-from-top'}`} src={NumberCircle} alt="cool circle" />}
                    <span className="dcoration-wrapper__text">{i + 1}</span>
                  </div>
                </Card>
                <Card
                  type={answer.selected ? "success" : "basic"}
                  className="o-layout__item value"
                  onClick={() => {
                    if (isSubmitted) {
                      return;
                    }

                    if (correct) {
                      this.onAnswerClick(i, this.selectCorrectAnswer)
                    } else {
                      this.onAnswerClick(i, () =>
                        this.selectAnswer(answer[0])
                      )
                    }
                  }}
                  disabled={isSubmitted && !answer.selected}
                >
                  {value}
                </Card>
              </div>
            </Fragment>
          );
        })}
      </div>
    );
  }
}

export default PickAnswerPage;
