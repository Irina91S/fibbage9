import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { databaseRefs } from './../../../lib/refs';
import { getToupleFromSnapshot } from './../../../lib/firebaseUtils';

const { games } = databaseRefs;

class GamesList extends React.Component {
  state = {
    gamesList: []
  };

  setGamesList = (gamesList) => {
    this.setState({gamesList});
  };

  renderListOfGames = () => {
    const { gamesList } = this.state;
    return gamesList.map((gameTouple, index) => {
      const [key, data] = gameTouple;
      console.log(key, data);

      if (!data.pincode || !data.name) return null;

      return (
        <Fragment key={key}>
          <li>
            <Link to={`/games/${key}`}>
              {data.name && <h3>{data.name}</h3>}
              <div>{data.pincode}</div>
            </Link>
            {index !== gamesList.length - 1 && <hr/>}
          </li>
        </Fragment>
      )
    });
  };

  componentDidMount() {
    games.on('value', (snapshot) => {

      console.log(getToupleFromSnapshot(snapshot.val()));
      this.setGamesList(getToupleFromSnapshot(snapshot.val()));
    });
  }

  componentWillUnmount() {
    games.off('value');
  }

  render() {
    return (
      <ul>
        {this.renderListOfGames().filter(Boolean)}
      </ul>
    );
  };
};

export default GamesList;