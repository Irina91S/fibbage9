import React, { Component } from 'react';
import anime from 'animejs';
import { databaseRefs } from './../../../lib/refs';
import { getToupleFromSnapshot } from '../../../lib/firebaseUtils';
import { useCurrentPlayer } from '../../../hooks';

import './AnswerResultsPage.scss';

import { Card, Animal } from '../../../shared';

import beerSvg from '../../../shared/assets/svg/beer.svg';

const { fakeAnswers, question, players, game, lobby } = databaseRefs;

class AnswerResultsPage extends Component {
  fakeAnswersRef = [];
  questionRef = {};
  playersRef = [];

  state = {
    fakeAnswers: [],
    questionScore: 0,
    correctAnswer: {},
    players: [],
    playerAnimal: [],
    beerAnimated: false
  };

  componentDidMount() {
    const { id, questionId } = this.props.match.params;

    this.fakeAnswersRef = fakeAnswers(id, questionId);
    this.questionRef = question(id, questionId);
    this.playersRef = players(id);
    this.gameRef = game(id);

    this.gameRef.child('/currentScreen').on('value', snapshot => {
      const { history } = this.props;
      if (snapshot.val()) {
        const { route } = snapshot.val();
        history.push(route);
      }
    });

    this.fakeAnswersRef.on('value', snapshot => {
      const fakeAnswers = getToupleFromSnapshot(snapshot.val());
      this.setState({ fakeAnswers });
    });

    this.questionRef.on('value', snapshot => {
      this.setState({
        questionScore: snapshot.val().score,
        correctAnswer: snapshot.val().answer
      });
    });

    this.playersRef.on('value', snapshot => {
      this.setState({
        players: getToupleFromSnapshot(snapshot.val())
      });
    });

    if (!this.state.beerAnimated) {
      this.setState({ beerAnimated: true });
      anime({
        targets: 'img.beer',
        opacity: [0, 1],
        translateY: [-15, 0],
        duration: 1000,
        easing: 'cubicBezier(0, 0.45, 0.74, 0.77)'
      });
    }
  }

  componentWillUnmount() {
    if (this.fakeAnswersRef) {
      this.fakeAnswersRef.off();
    }

    if (this.questionRef) {
      this.questionRef.off();
    }

    if (this.playersRef) {
      this.playersRef.off();
    }

    if (this.gameRef) {
      this.gameRef.off();
      this.gameRef.child('/currentScreen').off();
    }
  }

  componentDidUpdate() {
    anime({
      targets: '.card.anime',
      translateX: [-1000, 0],
      opacity: [0, 1],
      delay: anime.stagger(100),
      easing: 'easeInOutQuint',
      duration: 400
    });
  }

  getVotes = votedBy => {
    return votedBy
      ? getToupleFromSnapshot(votedBy).map((element, key) => (
        <span key={key}>{`${element[1]}  `}</span>
      ))
      : '';
  };

  getScoreForQuestion = (votesCount, correctAnswer, authorTeam) => {
    const { questionScore } = this.state;

    const votedCorrectAnswer =
      correctAnswer.votedBy && Object.keys(correctAnswer.votedBy).includes(authorTeam) ? 1 : 0;

    return votesCount * (questionScore / 2) + votedCorrectAnswer * questionScore;
  };

  getAllScoresForQuestion = () => {
    const { fakeAnswers, correctAnswer } = this.state;
    let scores = {};
    fakeAnswers.forEach(answer => {
      const [key, data] = answer;
      const voteCount = data.votedBy ? Object.values(data.votedBy).length : 0;
      data.voteCount = voteCount;

      const questionScore = this.getScoreForQuestion(voteCount, correctAnswer, key);
      const teamScore = { [data.authorTeam]: questionScore };
      scores = { ...scores, ...teamScore };
    });
    return scores;
  };

  getTeamNameById = teamId => {
    const { players } = this.state;
    let teamName = '';
    players.forEach(player => {
      const [key, data] = player;
      if (key === teamId) {
        teamName = data.nickname;
        return;
      }
    });
    return teamName;
  };

  getAnimalByTeam = teamId => {
    const { players } = this.state;
    let teamStyle = {};
    players.forEach(player => {
      const [key, data] = player;
      if (key === teamId) {
        teamStyle.animal = data.animal.animal;
        teamStyle.color = data.animal.color;
        return;
      }
    });
    return teamStyle;
  };

  render() {
    const { fakeAnswers, correctAnswer } = this.state;
    const { playerId } = useCurrentPlayer();

    const correctAnswerVotes = Object.values(correctAnswer.votedBy ? correctAnswer.votedBy : {});

    return (
      <div className="answer-results">
        <img src={beerSvg} className="beer" alt="berr" />
        <div className="o-layout--stretch u-margin-bottom-small" style={{ minHeight: 50 }}>
          <Card type="success" className="correct-answer u-weight-bold u-margin-right-tiny">
            {correctAnswer.value}
          </Card>
          <Card type="success" className="score o-block u-weight-bold">
            {correctAnswerVotes.map((answer, i) => {
              return (
                <Animal
                  key={i}
                  className="mini"
                  style={{
                    width: 15,
                    height: 15,
                    color: answer.color,
                    zIndex: correctAnswerVotes.length - i,
                    marginLeft: 0
                  }}
                  animal={answer.animal}
                />
              );
            })}
          </Card>
        </div>
        {fakeAnswers
          .filter(answer => {
            if (!answer[1].value) return;

            return answer;
          })
          .sort((a, b) => b[1].voteCount - a[1].voteCount)
          .map(answer => {
            const [key, data] = answer;
            const teamStyle = this.getAnimalByTeam(data.authorTeam);

            if (!data.value) return;

            return (
              <Card
                hasBg={answer[1].authorTeam == playerId}
                key={key}
                className="anime o-layout--flex u-margin-bottom-small"
                style={{ color: teamStyle.color }}
              >
                <div className="fake-answer">
                  <div className="answer">{data.value}</div>

                  <div className="team-name u-weight-bold">
                    Added by: {this.getTeamNameById(data.authorTeam)}
                  </div>

                  <div className="votes">
                    Votes: {data.voteCount} {data.votedBy && ' ( '}
                    {data.votedBy &&
                      Object.keys(data.votedBy).map(key => (
                        <Animal
                          key={key}
                          animal={data.votedBy[key].animal}
                          className="u-margin-right-tiny"
                        />
                      ))}{' '}
                    {data.votedBy && ' )'}
                  </div>
                </div>
                <Animal animal={teamStyle.animal} style={{ height: 72, width: 72 }} />
                <div className="bg"></div>
              </Card>
            );
          })}
      </div>
    );
  }
}

export default AnswerResultsPage;
