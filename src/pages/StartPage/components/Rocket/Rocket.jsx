import React, { useEffect } from 'react';
import './Rocket.scss';

import anime from 'animejs';

const Rocket = ({ active = false }) => {
  useEffect(() => {
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
  easing: 'easeInOutExpo'
};

const leaveAnimationConfig = {
  targets: entryAnimationConfig.targets,
  translateY: -1000,
  opacity: 0,
  easing: entryAnimationConfig.easing
};
