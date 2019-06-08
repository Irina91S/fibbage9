import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.css';
import AdminDashboard from './pages/AdminDashboardPage/AdminDashboard';
import GameDetails from './pages/GameDetailsPage/GameDetails'
import Start from './pages/StartPage/Start';
import AnswerResultsPage from './pages/GameLobbyPage/AnswerResultsPage/AnswerResultsPage';
import AddAnswerPage from './pages/GameLobbyPage/AddAnswerPage/AddAnswersPage';
import AddNickname from './pages/GameLobbyPage/AddNicknamePage/AddNicknamePage';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="header">
          <h3>This is the header</h3>
        </header>
        <main>
          <Route exact path="/" component={Start} />
          <Route exact path="/games" component={AdminDashboard} />
          <Route exact path="/games/:id" component={GameDetails} />
          <Route exact path="/lobby/:gameId/questions/:questionId/addAnswer" component={AddAnswerPage} />
          <Route exact path="/lobby/:gameId/questions/:questionId/results" component={AnswerResultsPage} />
          <Route exact path="/lobby/:gameId/nickname" component={AddNickname} />
        </main>
      </div>
    </Router>
  );
}

export default App;
