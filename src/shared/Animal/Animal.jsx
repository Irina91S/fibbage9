import React from "react";
import "./Animal.scss";
import { animalSvgs } from "../assets/AnimalsIllustrations/index";

const Animal = ({ animal, className, ...rest }) => {
  console.log(animalSvgs);

    const filteredAnimals = animalSvgs.filter(animalSvg => {
      const svgName = animalSvg
        .type.name.toLowerCase()
        .substring(3);

        console.log(svgName)
      return svgName === animal.toLowerCase();
    });

    console.log(animal, filteredAnimals);
  return (
    <div
      {...rest} name={animal}
      className={`o-layout--stretch o-layout--center animal ${
        className ? className : ""
      }`}
    >
      {filteredAnimals}
    </div>
  );
};

export default Animal;
