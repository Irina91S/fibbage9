import React, { Fragment, useEffect, useState } from 'react';
import { Route, withRouter } from 'react-router-dom';
import anime from 'animejs';
import './App.scss';

import Start from './pages/StartPage/Start';
import {
  AnswerResultsPage,
  AddAnswerPage,
  AddNicknamePage,
  WaitPlayersPage,
  PickAnswerPage,
  ScorePage,
  TotalScoresPage
} from './pages/GameLobbyPage';

import { Header } from './shared';

function App(props) {
  const [grayPage, setGrayPage] = useState(false);

  useEffect(() => {
    // TODO: improve logic
    // On certain pages, the background should be gray
    setGrayPage(props.location.pathname.endsWith('results'));

    // Each time the route changes, run this staggering animation
    anime({
      targets: '.page-transition-elem',
      translateY: [-15, 0],
      opacity: [0, 1],
      delay: anime.stagger(100),
      easing: 'cubicBezier(0, 0.45, 0.74, 0.77)'
    });
  }, [props]);

  return (
    <Fragment>
      <div className={`App ${grayPage ? 'bg-gray' : ''}`}>
        <Header title="Fibbage9" subtitle="Welcome to FIBBAGE, Levi9 version" />
        <main>
          <Route exact path="/" component={Start} />
          <Route
            exact
            path="/lobby/:gameId/questions/:questionId/addAnswer"
            component={AddAnswerPage}
          />
          <Route
            exact
            path="/lobby/:gameId/:questionId/pick-answer"
            component={PickAnswerPage}
          />
          <Route
            exact
            path="/lobby/:id/questions/:questionId/results"
            component={AnswerResultsPage}
          />
          <Route
            exact
            path="/lobby/:gameId/nickname"
            component={AddNicknamePage}
          />
          <Route
            exact
            path="/lobby/:gameId/wait-players"
            component={WaitPlayersPage}
          />
          <Route
            exact
            path="/lobby/:gameId/questions/:questionId/score"
            component={ScorePage}
          />
          <Route
            exact
            path="/lobby/:gameId/total-score"
            component={TotalScoresPage}
          />
        </main>
      </div>
    </Fragment>
  );
}

export default withRouter(App);
