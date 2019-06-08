import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.css';
import AdminDashboard from './pages/AdminDashboardPage/AdminDashboard';
import GameDetails from './pages/GameDetailsPage/GameDetails'
import Start from './pages/StartPage/Start';
import AddNickname from './pages/GameLobbyPage/AddNicknamePage/AddNicknamePage';

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
          <Route path="/games/:id" component={GameDetails} />
          <Route path="/lobby/:gameId/nickname" exact component={AddNickname} />
        </main>
      </div>
    </Router>
  );
}

export default App;
