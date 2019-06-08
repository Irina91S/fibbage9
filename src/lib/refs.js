import { database } from './../config/firebase';

export const databaseRefs = {
  games: database.ref('/games'),
  game: (id) => database.ref(`/games/${id}`),
  question: (id, questionId) => database.ref(`/games/${id}/questions/${questionId}`),
  fakeAnswers: (id, questionId) => database.ref(`/games/${id}/questions/${questionId}/fakeAnswers`),
  player: (gameId, playerId) => database.ref(`/games/${gameId}/players/${playerId}`),
  players: (gameId) => database.ref(`/games/${gameId}/players`),
};