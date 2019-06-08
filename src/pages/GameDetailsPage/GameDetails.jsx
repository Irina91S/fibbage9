import React from 'react';
import { databaseRefs } from './../../lib/refs';
import { getToupleFromSnapshot } from './../../lib/firebaseUtils';
import AddQuestionsForm from './GameDetails/AddQuestionForm';
import QuestionsList from './GameDetails/QuestionsList';

const { game } = databaseRefs;

class GameDetails extends React.Component {
  gameRef = '';

  state = {
    id: '',
    game: {}
  };

  handleQuestionSubmit = async ({question, answer}, actions) => {
    await this.gameRef.child('/questions')
      .push({
        question,
        answer
      });

    actions.resetForm();
  };

  handleGameActiveToggle = () => {
    const { isActive } = this.state.game;
    this.gameRef.child('isActive').set(!isActive);
  };

  componentDidMount() {
    const { id } = this.props.match.params;
    this.setState({id});
    this.gameRef = game(id);

    this.gameRef.on('value', snapshot => {
      this.setState({game: snapshot.val()});
    });
  };

  componentWillUnmount() {
    this.gameRef.off('value');
  }

  render() {
    // console.log(this.state);
    const { id } = this.state;
    console.log(id);
    const { pincode, name, limit, isActive, questions } = this.state.game;

    return (
      <div>
        <h3>{name} - {pincode}</h3>
        <h4>players limit {limit}</h4>
        <h4>
          {isActive ? 'Game is active' : 'Game not active'}
          <button 
            onClick={() => this.handleGameActiveToggle()}>
            {isActive ? 'Stop game' : 'Start game'}
          </button>
        </h4>
        <AddQuestionsForm handleSubmit={this.handleQuestionSubmit}/>
        {questions && <QuestionsList questions={getToupleFromSnapshot(questions)}/>}
      </div>
    );
  };
};

export default GameDetails;