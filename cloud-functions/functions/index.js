const functions = require('firebase-functions');
const admin = require('firebase-admin');
const animalsList = require('./animalsList');
const questionsList = require('./questionsList');
const SCREENS = require('./screensEnum');

admin.initializeApp(functions.config().firebase);

const updateVoteCount = snapshot => {
  const length = Object.keys(snapshot.after.val()).length;
  return snapshot.after.ref.parent.child('voteCount').set(length);
}

// [Update Players Score]
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

// [Increment Fake Answer Vote Count]
exports.incrementFakeAnswerVoteCount = functions.database
  .ref('/games/{gameId}/questions/{questionId}/fakeAnswers/{fakeAnswerId}/votedBy')
  .onWrite(updateVoteCount);

// [Increment Correct Answer Vote Count]
exports.incrementCorrectAnswerVoteCount = functions.database
  .ref('/games/{gameId}/questions/{questionId}/answer/votedBy')
  .onWrite(updateVoteCount);

// [Assigns random animal to players]
exports.addAnimalToPlayer = functions.database.ref('/games/{gameId}/players/{playerId}').onCreate(snapshot => {
  const data = snapshot.val();

  return snapshot.ref.parent.parent.child('/animals').once('value').then(snap => {
    const animalData = Object.entries(snap.val());
    console.log('[setting animal data]:', animalData);

    const tryToAssignAnimal = () => {
      const animalToBeAssigned = Math.floor(Math.random() * animalData.length);
      console.log('animalToBeAssigned', animalToBeAssigned);

      if (animalData[animalToBeAssigned][1].isTaken) {
        console.log(animalData[animalToBeAssigned][1].isTaken === true ? 'is taken' : 'not taken');
        tryToAssignAnimal();
        return null;
      } else {
        console.log('animalToBeAssignedID', animalData[animalToBeAssigned][0])
        console.log('animalToBeAssignedData', animalData[animalToBeAssigned][1])
        snapshot.ref.parent.parent
          .child(`/animals/${animalData[animalToBeAssigned][0]}`)
          .set({
            ...animalData[animalToBeAssigned][1],
            isTaken: true
          });

        snapshot.ref.set({
          ...data,
          animal: {
            animal: animalData[animalToBeAssigned][1].animal,
            color: animalData[animalToBeAssigned][1].color
          }
        })

        return null;
      }
    }

    tryToAssignAnimal();

    return null;
  });
});

// [Adds array of animals to a new created game]
exports.populateGameWithAnimals = functions.database.ref('/games/{gameId}').onCreate(snapshot => {
  return snapshot.ref.child('/animals').set(animalsList);
});

exports.populateGameWithQuestions = functions.database.ref('/games/{gameId}').onCreate(gameSnapshot => {
  return gameSnapshot.ref
    .child('/addQuestionsToGame')
    .once('value')
    .then(snapshot => {
      const shouldAddQuestionsToGame = snapshot.val();

      if (!shouldAddQuestionsToGame) {
        return null;
      }

      gameSnapshot.ref.child('/questions').set(questionsList);

      return null;
    })
});