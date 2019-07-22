import React from 'react';
import './Animal.scss';
import { animalSvgs } from '../assets/AnimalsIllustrations/index';

const Animal = ({ animal, className, ...rest }) => {
  const filteredAnimals = animalSvgs.filter(animalSvg => {
    const svgName = animalSvg.type.name.toLowerCase().substring(3);

    if (!animal) {
      return false;
    }

    return svgName === animal.toLowerCase();
  });
  return (
    <div
      {...rest}
      name={animal}
      className={`o-layout--stretch o-layout--center animal ${className ? className : ''}`}
    >
      {filteredAnimals}
    </div>
  );
};

export default Animal;
