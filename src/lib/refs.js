import { database } from "./../config/firebase";

export const databaseRefs = {
  games: database.ref("/games"),
  game: id => database.ref(`/games/${id}`),
  lobby: (gameId, questionId) =>
    database.ref(`/games/${gameId}/questions/${questionId}`)
};
 