import { database } from './../config/firebase';

export const databaseRefs = {
  games: database.ref('/games'),
  game: (id) => database.ref(`/games/${id}`)
};