import React, { useEffect } from 'react';
import anime from 'animejs';

import './SplashScreen.scss';

class SplashScreen extends React.Component {
  componentDidMount() {
    setTimeout(() => {
      anime
        .timeline({ loop: false })
        .add({
          targets: '.container',
          height: [0, '100vh'],
          easing: 'easeOutExpo',
          duration: 800
        })
        .add({
          targets: '.info',
          translateY: [30, 0],
          opacity: [0, 1],
          easing: 'easeOutExpo',
          duration: 1100
        })
        .add({
          targets: '.letter',
          translateX: [40, 0],
          opacity: [0, 1],
          easing: 'easeOutExpo',
          duration: 900,
          delay: function(el, i) {
            return 400 + 30 * i;
          }
        })
        .add({
          targets: '.letter',
          translateX: [0, -30],
          opacity: [1, 0],
          easing: 'easeInExpo',
          duration: 800,
          delay: function(el, i) {
            return 100 + 30 * i;
          }
        })
        .add({
          targets: '.container',
          opacity: [1, 0],
          easing: 'easeOutExpo',
          duration: 900
        }).complete = () => {
        this.props.onComplete();
      };
    }, 100);
  }

  renderLetter = (text = 'Levi9 edition') =>
    text.split('').map(letter => (
      <span
        key={letter + 100 * Math.random()}
        style={{ width: letter.trim() ? '' : '4px' }}
        className="letter "
      >
        {letter}
      </span>
    ));

  render() {
    return (
      <div className="splash-screen container">
        <div className="branding u-h1 u-margin-bottom">Fibbage</div>
        <div className="infoo u-h3">{this.renderLetter()}</div>
      </div>
    );
  }
}

export default SplashScreen;
