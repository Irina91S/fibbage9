const functions = require('firebase-functions');
const admin = require('firebase-admin');
const animalsList = require('./animalsList');

admin.initializeApp(functions.config().firebase);

const updateVoteCount = snapshot => {
  const length = Object.keys(snapshot.after.val()).length;
  return snapshot.after.ref.parent.child('voteCount').set(length);
}

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