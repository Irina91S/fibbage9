import React from 'react';

import Owl from '../../../shared/assets/AnimalsIllustrations/Owl';
import Panther from '../../../shared/assets/AnimalsIllustrations/Panther';
import Llama from '../../../shared/assets/AnimalsIllustrations/Llama';
import Lion from '../../../shared/assets/AnimalsIllustrations/Lion';
import Fish from '../../../shared/assets/AnimalsIllustrations/Fish';
import Bear from '../../../shared/assets/AnimalsIllustrations/Bear';

import './WaitingScreen.scss';

const Loader = () => {
  return (
    <div className="container">
      <div className="circle">
        <div className="trio first">
          <div className="animalWaitingScreen owl">
            <Owl />
          </div>
          <div className="animalWaitingScreen panther">
            <Panther />
          </div>
          <div className="animalWaitingScreen llama">
            <Llama />
          </div>
        </div>
        <div className="trio second">
          <div className="animalWaitingScreen fish">
            <Fish />
          </div>
          <div className="animalWaitingScreen bear">
            <Bear />
          </div>
          <div className="animalWaitingScreen lion">
            <Lion />
          </div>
        </div>
      </div>
      <div className="info">
        Please be kind and wait, our 🐹 hamster 🐹 is working hard so we can process your bullshit
      </div>
    </div>
  );
};

export default Loader;
