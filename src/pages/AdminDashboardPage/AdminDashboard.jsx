import React, { Fragment, useState } from 'react';
import { databaseRefs } from './../../lib/refs';
import CreateGameForm from './AdminDashboard/CreateGameForm';
import GamesList from './AdminDashboard/GamesList';

const { games } = databaseRefs;

const AdminDashboard = () => {
  const [isCreateGameVisible, setIsCreateGameVisible] = useState(false);

  const handleSubmit = async ({ name, pincode }, actions) => {
    await games.push({
      isActive: false,
      questions: [],
      players: [],
      limit: 5,
      name,
      pincode
    });

    setIsCreateGameVisible(false);
  };

  return (
    <Fragment>
      <GamesList/>
      {!isCreateGameVisible && <button onClick={() => setIsCreateGameVisible(true)}>Create game</button>}
      {isCreateGameVisible && <CreateGameForm handleSubmit={handleSubmit} handleCancel={() => setIsCreateGameVisible(false)} />}
    </Fragment>
  )
};

export default AdminDashboard;