const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

exports.addAnimalToPlayer = functions.database.ref('/games/{gameId}/players/{playerId}').onCreate(snapshot => {
  const data = snapshot.val();
  console.log(data, 'ref data');
  console.log(snapshot);
  const animals = snapshot.ref.parent.parent.child('/animals').once('value').then(snap => {
    const animalData = Object.entries(snap.val());
    console.log(animalData, 'animal data');

    const availableAnimal = animalData.find((animal) => {
      const [id, animalObj] = animal;

      if (!animalObj.isTaken) {
        return animal;
      }

      return;
    });

    console.log(availableAnimal, 'available animal');

    snapshot.ref.parent.parent
      .child(`/animals/${availableAnimal[0]}`)
      .set({
        ...availableAnimal[1],
        isTaken: true
      });

    delete availableAnimal.isTaken;

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