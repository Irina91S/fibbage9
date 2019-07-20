import React from "react";
import "./Animal.scss";
import { animalSvgs } from "../assets/AnimalsIllustrations/index";

const Animal = ({ animal, className, ...rest }) => {

    const filteredAnimals = animalSvgs.filter(animalSvg => {
      const svgName = animalSvg
        .type.name.toLowerCase()
        .substring(3);
      return svgName.includes(animal);
    });

  return (
    <div
      {...rest}
      className={`o-layout--stretch o-layout--center  ${
        className ? className : ""
      }`}
    >
      <div >{filteredAnimals}</div>
    </div>
  );
};

export default Animal;
