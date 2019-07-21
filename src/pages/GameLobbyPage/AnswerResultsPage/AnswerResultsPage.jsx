import React, { Component } from "react";
import anime from "animejs";
import { databaseRefs } from "./../../../lib/refs";
import { getToupleFromSnapshot } from "../../../lib/firebaseUtils";
import { useCurrentPlayer } from "../../../hooks";

import "./AnswerResultsPage.scss";

import { Card, Animal } from "../../../shared";

const { fakeAnswers, question, players } = databaseRefs;

class AnswerResultsPage extends Component {
  fakeAnswersRef = [];
  questionRef = {};
  playersRef = [];

  state = {
    fakeAnswers: [],
    questionScore: 0,
    correctAnswer: {},
    players: [],
    playerAnimal: []
  };

  componentDidMount() {
    const { id, questionId } = this.props.match.params;

    this.fakeAnswersRef = fakeAnswers(id, questionId);
    this.questionRef = question(id, questionId);
    this.playersRef = players(id);

    const currentPlayer = useCurrentPlayer();

    this.fakeAnswersRef.on("value", snapshot => {
      const fakeAnswers = getToupleFromSnapshot(snapshot.val()).filter(
        answer => answer[1].authorTeam !== currentPlayer.playerId
      );
      this.setState({ fakeAnswers });
    });

    this.questionRef.on("value", snapshot => {
      this.setState({
        questionScore: snapshot.val().score,
        correctAnswer: snapshot.val().answer
      });
    });

    this.playersRef.on("value", snapshot => {
      this.setState({
        players: getToupleFromSnapshot(snapshot.val())
      });
    });
  }

  componentWillUnmount() {
    this.fakeAnswersRef.off();
    this.questionRef.off();
    this.playersRef.off();
  }

  componentDidUpdate() {
    anime({
      targets: ".card.anime",
      translateX: [-1000, 0],
      opacity: [0, 1],
      delay: anime.stagger(100),
      easing: "easeInOutQuint",
      duration: 400
    });
  }

  getVotes = votedBy => {
    return votedBy
      ? getToupleFromSnapshot(votedBy).map((element, key) => (
        <span key={key}>{`${element[1]}  `}</span>
      ))
      : "";
  };

  getScoreForQuestion = (votesCount, correctAnswer, authorTeam) => {
    const { questionScore } = this.state;

    const votedCorrectAnswer =
      correctAnswer.votedBy &&
        Object.keys(correctAnswer.votedBy).includes(authorTeam)
        ? 1
        : 0;

    return (
      votesCount * (questionScore / 2) + votedCorrectAnswer * questionScore
    );
  };

  getAllScoresForQuestion = () => {
    const { fakeAnswers, correctAnswer } = this.state;
    let scores = {};
    fakeAnswers.forEach(answer => {
      const [key, data] = answer;
      const voteCount = data.votedBy ? Object.values(data.votedBy).length : 0;
      data.voteCount = voteCount;

      const questionScore = this.getScoreForQuestion(
        voteCount,
        correctAnswer,
        key
      );
      const teamScore = { [data.authorTeam]: questionScore };
      scores = { ...scores, ...teamScore };
    });
    return scores;
  };

  getTeamNameById = teamId => {
    const { players } = this.state;
    let teamName = "";
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
    return (
      <div className="answer-results">
        <div className="o-layout--stretch u-margin-bottom-small">
          <Card type="success" className="score o-block u-weight-bold">
            0
          </Card>
          <Card
            type="success"
            className="correct-answer u-weight-bold u-margin-left-tiny"
          >
            {correctAnswer.value}
          </Card>
        </div>
        {fakeAnswers.map(answer => {
          const [key, data] = answer;
          const teamStyle = this.getAnimalByTeam(data.authorTeam);
          return (
            <Card
              key={key}
              className="anime o-layout--flex u-margin-bottom-small"
              style={{ color: teamStyle.color }}
            >
              <div className="fake-answer">
                <div className="team-name u-weight-bold">
                  {this.getTeamNameById(data.authorTeam)}
                </div>

                <div className="answer">{data.value}</div>
                <div className="votes">Votes: {data.voteCount}</div>
                <div className="voted-by ">
                  {data.votedBy &&
                    Object.keys(data.votedBy).map(key => (
                      <Animal key={key} animal={data.votedBy[key].animal} style={{ width: "30px", height: "30px" }} />
                    ))}
                </div>
              </div>
              <Animal animal={teamStyle.animal} style={{ height: 72, width: 72 }} />
            </Card>
          );
        })}
      </div>
    );
  }
}

export default AnswerResultsPage;
