const functions = require('firebase-functions');
const admin = require('firebase-admin');
const animalsList = require('./animalsList');
const SCREENS = require('./screensEnum');

admin.initializeApp(functions.config().firebase);

const updateVoteCount = snapshot => {
  const length = Object.keys(snapshot.after.val()).length;
  return snapshot.after.ref.parent.child('voteCount').set(length);
}

exports.updatePlayersScore = functions.database.ref('/games/{gameId}/currentScreen').onUpdate(async (snapshot) => {
  const game = (await snapshot.after.ref.parent.once('value')).val();

  if (game.currentScreen.screenId !== SCREENS.RESULTS) return null;

  const currentQuestion = game.questions[game.currentQuestion];
  const correctAnswer = currentQuestion.answer;
  const fakeAnswers = Object.entries(currentQuestion.fakeAnswers ? currentQuestion.fakeAnswers : {});

  const voters = Object.entries(correctAnswer.votedBy ? correctAnswer.votedBy : {})
  for (const voter of voters) {
    const id = voter[0];
    game.players[id].totalScore += currentQuestion.score;
  }

  for (const fakeAnswer of fakeAnswers) {
    const data = fakeAnswer[1];
    game.players[data.authorTeam].totalScore += currentQuestion.score / 2 * data.voteCount;
  }

  return snapshot.after.ref.parent.child('players').update(game.players);
});

exports.incrementFakeAnswerVoteCount = functions.database
  .ref('/games/{gameId}/questions/{questionId}/fakeAnswers/{fakeAnswerId}/votedBy')
  .onWrite(updateVoteCount);

exports.incrementCorrectAnswerVoteCount = functions.database
  .ref('/games/{gameId}/questions/{questionId}/answer/votedBy')
  .onWrite(updateVoteCount);

exports.addAnimalToPlayer = functions.database.ref('/games/{gameId}/players/{playerId}').onCreate(snapshot => {
  const data = snapshot.val();

  return snapshot.ref.parent.parent.child('/animals').once('value').then(snap => {
    const animalData = Object.entries(snap.val());
    console.log('[setting animal data]:', animalData);

    const availableAnimal = animalData.find((animal) => {
      const [id, animalObj] = animal;

      if (!animalObj.isTaken) {
        return animal;
      }

      return;
    });

    snapshot.ref.parent.parent
      .child(`/animals/${availableAnimal[0]}`)
      .set({
        ...availableAnimal[1],
        isTaken: true
      });

    snapshot.ref.set({
      ...data,
      animal: {
        animal: availableAnimal[1].animal,
        color: availableAnimal[1].color
      }
    })

    return null;
  });
});

exports.populateGameWithAnimals = functions.database.ref('/games/{gameId}').onCreate(snapshot => {
  console.log(animalsList);
  return snapshot.ref.child('/animals').set(animalsList);
});