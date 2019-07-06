import React, { Component } from 'react';
import { databaseRefs } from './../../../lib/refs';
import { getToupleFromSnapshot } from '../../../lib/firebaseUtils';

const { fakeAnswers, question } = databaseRefs;

class AnswerResultsPage extends Component {
  fakeAnswersRef = [];
  questionRef = {};

  state = {
    fakeAnswers: [],
    questionScore: 0 
  }

  componentDidMount() {
    const { id, questionId } = this.props.match.params;
    this.fakeAnswersRef = fakeAnswers(id, questionId);
    this.questionRef = question(id, questionId);

    this.fakeAnswersRef.on('value', snapshot => {
      console.log(snapshot.val())
      // if(snapshot.val()) {
        this.setState({
          fakeAnswers: getToupleFromSnapshot(snapshot.val())
        });
      // }
    });
    
    this.questionRef.on('value', snapshot => {
      this.setState({ questionScore: snapshot.val().score})
    })
  }

  componentWillUnmount() {
    this.fakeAnswersRef.off();
    this.questionRef.off();
  }

  getVotes = (votedBy) => {
    return getToupleFromSnapshot(votedBy).map((element, key) => (
      <span key={key}>{`${element[1]}  `}</span>
    ));
  }

  getScoreForQuestion = (votesCount, correctAnswer = 0) => {
    const { questionScore } = this.state;
    return votesCount * (questionScore/2) + (correctAnswer * questionScore);
  }

  render() {
    const { fakeAnswers } = this.state;
    return (
      <div>
        These are the answers:
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
              Points for this question: {this.getScoreForQuestion(voteCount, data.correctAnswer)}
            </div>
            <hr />
          </div>
        )})}
      </div>
    )
  }
}

export default AnswerResultsPage;