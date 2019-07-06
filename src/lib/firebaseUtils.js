import { databaseRefs } from './refs';

const { timer } = databaseRefs;

export const getToupleFromSnapshot = (snapshot) => Object.entries(snapshot);

export const startTimerForGame = (gameId) => {
  const timerRef = timer(gameId);
  const endTime = new Date();
  endTime.setSeconds(endTime.getSeconds() + 30);
  timerRef
    .child('/endTime')
    .set(endTime.getTime());
};