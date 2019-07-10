import React, { Component } from 'react';
import { databaseRefs } from './../../../lib/refs';
import { getToupleFromSnapshot } from '../../../lib/firebaseUtils';

const { fakeAnswers, question, players } = databaseRefs;

class AnswerResultsPage extends Component {
  fakeAnswersRef = [];
  questionRef = {};
  playersRef = [];

  state = {
    fakeAnswers: [],
    questionScore: 0,
    correctAnswer: {},
    players: []
  }

  async componentDidMount() {
    const { id, questionId } = this.props.match.params;
    this.fakeAnswersRef = fakeAnswers(id, questionId);
    this.questionRef = question(id, questionId);
    this.playersRef = players(id);

    await this.fakeAnswersRef.once('value', snapshot => {
      this.setState({
        fakeAnswers: getToupleFromSnapshot(snapshot.val())
      });
    });
    
    await this.questionRef.once('value', snapshot => {
      this.setState({ questionScore: snapshot.val().score, correctAnswer: snapshot.val().answer})
    })

    await this.playersRef.once('value', snapshot => {
      this.setState({
        players: getToupleFromSnapshot(snapshot.val())
      }, () =>  this.updatePlayersScores())
    })
  }

  componentWillUnmount() {
    this.fakeAnswersRef.off();
    this.questionRef.off();
    this.playersRef.off();
  }

  getVotes = (votedBy) => {
    return getToupleFromSnapshot(votedBy).map((element, key) => (
      <span key={key}>{`${element[1]}  `}</span>
    ));
  }

  getScoreForQuestion = (votesCount, correctAnswer, authorTeam) => {
    const { questionScore } = this.state;

    const votedCorrectAnswer = correctAnswer.votedBy && Object.keys(correctAnswer.votedBy).includes(authorTeam) ? 1 : 0;

    return votesCount * (questionScore/2) + (votedCorrectAnswer * questionScore);
  }

  updatePlayersScores = () => {
    const { players } = this.state;
    const scores = this.getAllScoresForQuestion();

    players.forEach(player => {
      const [key, data] = player;
      const { totalScore } = data;
      const newScore = scores.key;
      const updatedScore = totalScore + newScore;

      this.playersRef
        .child(key)
        .child('/totalScore')
        .set(updatedScore);
    });
  }

  getAllScoresForQuestion = () => {
    const { fakeAnswers, correctAnswer } = this.state;
    let scores = {};
    fakeAnswers.forEach(answer => {
      const [key, data] = answer;
      const voteCount = data.votedBy ? Object.values(data.votedBy).length : 0;
      const questionScore = this.getScoreForQuestion(voteCount, correctAnswer, key);
      const teamScore = { [answer.authorTeam]: questionScore };
      scores = {...scores, ...teamScore};
    });
    return scores;
  }

  render() {
    const { fakeAnswers, correctAnswer } = this.state;
    return (
      <div>
        These are the answers:
        <div>
          The correct answer: 
          {correctAnswer.value}
          <br/>
          voted by: {this.getVotes(correctAnswer.votedBy)}
        </div>
        <hr/>
        {fakeAnswers.map((answer) => {
          const [key, data] = answer;
          const voteCount = data.votedBy ? Object.values(data.votedBy).length : 0;
          return (
          <div key={key}>
            <div>
              answer: {data.value}
            </div>
            <div>
              author team: {data.authorTeam}
            </div>
            <div>
              vote count: {voteCount}
            </div>
            {data.votedBy && <div>
              voted by: {this.getVotes(data.votedBy)}
            </div>}
            <div>
              Points for this question: {this.getScoreForQuestion(voteCount, correctAnswer, data.authorTeam)}
            </div>
            <hr />
          </div>
        )})}
      </div>
    )
  }
}

export default AnswerResultsPage;