import React, { useState, useEffect } from 'react';
import SVG from 'react-inlinesvg';
import './Rocket.scss';

import anime from 'animejs';

import clouds from './clouds.svg';
import rocket from './rocket.svg';

const easing = 'easeInOutQuint';

const Rocket = ({ active = false }) => {
  useEffect(() => {
    // When the page first loads, set the position of the rocket
    // so that it will not be pushed up when opening keyboard on phone
    const container = document.querySelector('.rocket-container');
    const rocket = document.querySelector('.rocket');
    container.style.top = `0`;
    container.style.marginTop = `${window.innerHeight - rocket.clientHeight}px`;
    container.style.height = `${rocket.clientHeight}px`;

    anime({
      targets: '.clouds',
      opacity: 1,
      easing: easing,
      duration: 2000
    });

    anime({
      targets: '.rocket',
      translateY: [1000, 0],
      opacity: 1,
      easing: easing
    });
  }, []);

  useEffect(() => {
    if (active) {
      anime({
        targets: '.clouds',
        translateY: 1000,
        opacity: 0,
        easing: easing
      });

      anime({
        targets: '.rocket',
        translateY: -1000,
        opacity: 0,
        easing: easing
      });
    }
  }, [active]);

  return (
    <div className="rocket-container o-layout--stretch o-layout--center">
      <img src={rocket} className="rocket" />
      <img src={clouds} className="clouds" />
    </div>
  );
};

export default Rocket;
