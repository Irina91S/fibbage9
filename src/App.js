import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.css';
import AdminDashboard from './pages/AdminDashboardPage/AdminDashboard';
import GameDetails from './pages/GameDetailsPage/GameDetails'
import Start from './pages/StartPage/Start';
import AnswerResultsPage from './pages/GameLobbyPage/AnswerResultsPage/AnswerResultsPage';
import AddAnswerPage from './pages/GameLobbyPage/AddAnswerPage/AddAnswersPage';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="header">
          <h3>This is the header</h3>
        </header>
        <main>
          <Route path="/" exact component={Start} />
          <Route path="/games" exact component={AdminDashboard} />
          <Route exact path="/games/:id" component={GameDetails} />
          <Route exact path="/games/:id/questions/:questionId/addAnswer" component={AddAnswerPage} />
          <Route exact path="/lobby/:id/questions/:questionId/results" component={AnswerResultsPage} />
        </main>
      </div>
    </Router>
  );
}

export default App;
