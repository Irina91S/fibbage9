import React, { useState, useEffect } from 'react';
import './Rocket.scss';

import anime from 'animejs';

const Rocket = ({ active = false }) => {
  useEffect(() => {
    // When the page first loads, set the position of the rocket
    // so that it will not be pushed up when opening keyboard on phone
    // console.log(window.innerHeight);
    const rocket = document.querySelector('.rocket-container');
    // console.dir(rocket);
    rocket.style.top = `calc(${window.innerHeight}px + 450px)`;

    anime(entryAnimationConfig);
  }, []);

  useEffect(() => {
    if (active) {
      anime(leaveAnimationConfig);
    }
  }, [active]);

  return (
    <div className="rocket-container o-layout--stretch o-layout--center">
      <div className="rocket o-layout__item" />
    </div>
  );
};

export default Rocket;

const entryAnimationConfig = {
  targets: '.rocket-container',
  translateY: -550,
  opacity: 1,
  easing: 'easeInOutQuint'
};

const leaveAnimationConfig = {
  targets: entryAnimationConfig.targets,
  translateY: -1000,
  opacity: 0,
  easing: entryAnimationConfig.easing
};
