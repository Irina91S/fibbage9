import React from 'react';
import './Animal.scss';
import { animals as animalSvgs } from '../assets/AnimalsIllustrations/index';

const Animal = ({ animal, className, ...rest }) => {
  if (!animal) {
    return null;
  }

  return (
    <div
      {...rest}
      name={animal}
      className={`o-layout--stretch o-layout--center animal ${className ? className : ''}`}
    >
      {animalSvgs[animal.toLowerCase()]}
    </div>
  );
};

export default Animal;
