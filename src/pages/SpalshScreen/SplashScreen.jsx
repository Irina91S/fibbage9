import React, { useEffect } from "react";
import anime from 'animejs';

import "./SplashScreen.scss";

class SplashScreen extends React.Component {
  componentDidMount() {
    anime.timeline({ loop: true }).add({
      targets: '.letter',
      translateX: [40, 0],
      translateZ: 0,
      opacity: [0, 1],
      easing: "easeOutExpo",
      duration: 1200,
      delay: function (el, i) {
        return 500 + 30 * i;
      }
    }).add({
      targets: '.letter',
      translateX: [0, -30],
      opacity: [1, 0],
      easing: "easeInExpo",
      duration: 3000,
      delay: function (el, i) {
        return 100 + 30 * i;
      }
    });
  }

  renderLetter = (text = 'Levi9 edition') => (
    text.split('').map((letter) => (
      <span
        key={letter + (100 * Math.random())}
        style={{ width: letter.trim() ? '' : '4px' }}
        className="letter ">{letter}
      </span>
    ))
  );

  render() {
    return (
      <div className="container">
        <div className="branding u-h1 u-margin-bottom">
          Fibbage
            </div>
        <div className="infoo u-h3">
          {this.renderLetter()}
        </div>
      </div>
    );
  }

};

export default SplashScreen;
