import { database } from './../config/firebase';

export const databaseRefs = {
  games: database.ref('/games'),
  game: (id) => database.ref(`/games/${id}`),
  player: (gameId, playerId) => database.ref(`/games/${gameId}/players/${playerId}`),
  players: (gameId) => database.ref(`/games/${gameId}/players`)
};