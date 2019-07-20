import React from 'react';
import './Animal.scss';

const Animal = ({ className, ...rest }) => {
  return (
    <div
      {...rest}
      className={`o-layout--stretch o-layout--center u-1/3 ${
        className ? className : ''
      }`}
    >
      <div className="animal" />
    </div>
  );
};

export default Animal;
