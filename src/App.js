import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.scss';
import Start from './pages/StartPage/Start';
import AnswerResultsPage from './pages/GameLobbyPage/AnswerResultsPage/AnswerResultsPage';
import AddAnswerPage from './pages/GameLobbyPage/AddAnswerPage/AddAnswersPage';
import AddNicknamePage from './pages/GameLobbyPage/AddNicknamePage/AddNicknamePage';
import WaitPlayersPage from './pages/GameLobbyPage/WaitPlayersPage/WaitPlayersPage';

import PickAnswerPage from './pages/GameLobbyPage/PickAnswerPage/PickAnswerPage';
import ScorePage from './pages/GameLobbyPage/ScorePage/ScorePage';
import TotalScorePage from './pages/GameLobbyPage/TotalScoresPage/TotalScoresPage';

import { Header } from './shared';

function App() {
  return (
    <Router>
      <div className="App">
        <Header title="Fibbage9" subtitle="Welcome to FIBBAGE, Levi9 version" />
        <main>
          <Route exact path="/" component={Start} />
          <Route exact path="/lobby/:gameId/questions/:questionId/addAnswer" component={AddAnswerPage} />
          <Route exact path="/lobby/:gameId/:questionId/pick-answer" component={PickAnswerPage} />
          <Route exact path="/lobby/:id/questions/:questionId/results" component={AnswerResultsPage} />
          <Route exact path="/lobby/:gameId/nickname" component={AddNicknamePage} />
          <Route exact path="/lobby/:gameId/wait-players" component={WaitPlayersPage} />
          <Route exact path="/lobby/:gameId/questions/:questionId/score" component={ScorePage} />
          <Route exact path="/lobby/:gameId/total-score" component={TotalScorePage} />
        </main>
      </div>
    </Router>
  );
}

export default App;
