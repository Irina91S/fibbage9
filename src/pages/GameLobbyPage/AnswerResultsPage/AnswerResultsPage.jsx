import React, { Component } from 'react';
import { databaseRefs } from './../../../lib/refs';
import { getToupleFromSnapshot } from '../../../lib/firebaseUtils';

const { fakeAnswers } = databaseRefs;

class AnswerResultsPage extends Component {
  state = {
    fakeAnswers: []
  }

  componentDidMount() {
    const { gameId, questionId } = this.props.match.params;
    this.fakeAnswersRef = fakeAnswers(gameId, questionId);

    this.fakeAnswersRef.on('value', snapshot => {
      this.setState({
        fakeAnswers: getToupleFromSnapshot(snapshot.val())
      });
    });
  }

  getVotes = (votedBy) => {
    return getToupleFromSnapshot(votedBy).map((element, key) => (
      <span key={key}>{`${element[1]}  `}</span>
    ));
  }

  render() {
    const { fakeAnswers } = this.state;
    return (
      <div>
        These are the answers:
        {fakeAnswers.map((answer, key) => (
          <div key={key}>
            <div>
              answer: {answer[1].value}
            </div>
            <div>
              autor team: {answer[1].authorTeam}
            </div>
            <div>
              vote count: {answer[1].voteCount}
            </div>
            {answer[1].votedBy && <div>
              voted by: {this.getVotes(answer[1].votedBy)}
            </div>}
            <hr />
          </div>
        ))}
      </div>
    )
  }
}

export default AnswerResultsPage;