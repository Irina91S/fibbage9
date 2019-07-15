import React from "react";
import { databaseRefs } from "./../../lib/refs";
import { getToupleFromSnapshot, startTimerForGame } from "./../../lib/firebaseUtils";
import AddQuestionsForm from "./GameDetails/AddQuestionForm";
import QuestionsList from "./GameDetails/QuestionsList";
import Timer from '../../shared/Timer';

const { game } = databaseRefs;

class GameDetails extends React.Component {
  gameRef = "";

  state = {
    id: "",
    game: {}
  };

  startTimer = async () => {
    const { id } = this.state;
    startTimerForGame(id);
  };

  handleQuestionSubmit = async ({ question, answer, score }, actions) => {
    const { game } = this.state;
    const index = this.getQuestionsLength(game);
    
    await this.gameRef.child("/questions").push({
      question,
      answer: {
        value: answer
      },
      score,
      index
    });
    actions.resetForm();
  };

  handleGameActiveToggle = () => {
    const { isActive } = this.state.game;
    this.gameRef.child("isActive").set(!isActive);
  };

  handleStartGame = () => {
    const { id } = this.state;
    const { questions } = this.state.game;

    const gameRef = game(id);
    const questionId = Object.keys(questions)[0];

    const currentScreen = {
      route: `/lobby/${id}/questions/${questionId}/addAnswer`,
      screenId: 'ANSWER'
    };

    gameRef.child("/currentScreen").set(currentScreen);
  };

  componentDidMount() {
    const { id } = this.props.match.params;

    this.setState({ id });
    this.gameRef = game(id);

    this.gameRef.on("value", snapshot => {
      console.log(snapshot.val());
      this.setState({ game: snapshot.val() });
    });
  }

  componentWillUnmount() {
    this.gameRef.off("value");
  }

  getQuestionsLength = (game) => {
    if (!game.questions) {
      return 0;
    }
    return Object.values(game.questions).length;
  }

  render() {
    const { id, game } = this.state;
    const { pincode, name, limit, isActive, questions } = game;
    return (
      <div>
        <h3>
          {name} - {pincode}
        </h3>
        {game.timer && <Timer endTime={game.timer.endTime} size="300px"/>}
        <button onClick={this.startTimer}>start timer</button>
        <h4>players limit {limit}</h4>
        <h4>
          {isActive ? "Game is active" : "Game not active"}
          <button onClick={() => this.handleGameActiveToggle()}>
            {isActive ? "Kill game" : "Activate Game"}
          </button>
          <button onClick={() => this.handleStartGame()}>Start</button>
        </h4>
        <AddQuestionsForm handleSubmit={this.handleQuestionSubmit} />
        {questions && (
          <QuestionsList
            questions={getToupleFromSnapshot(questions)}
            gameId={id}
          />
        )}
      </div>
    );
  }
}

export default GameDetails;
