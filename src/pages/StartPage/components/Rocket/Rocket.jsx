import React, { useEffect } from 'react';
import './Rocket.scss';

import anime from 'animejs';
import { Footer } from '../../../../shared';

import clouds from './clouds.svg';
import rocket from './rocket.svg';

const easing = 'easeInOutQuint';

const Rocket = ({ active = false }) => {
  useEffect(() => {
    anime({
      targets: '.clouds',
      opacity: 1,
      easing: easing,
      duration: 2000
    });

    anime({
      targets: '.rocket',
      translateY: [1000, 0],
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
    <Footer>
      <img src={rocket} className="footer-image rocket" />
      <img src={clouds} className="clouds" />
    </Footer>
  );
};

export default Rocket;
