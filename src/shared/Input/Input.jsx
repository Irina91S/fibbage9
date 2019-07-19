import React from 'react';
import anime from 'animejs';
import SVG from 'react-inlinesvg';

import xMark from './x-mark.svg';
import './Input.scss';

const Input = props => {
  const invalid = Object.keys(props.errors).length > 0;

  return (
    <div className={`input ${invalid && 'invalid'}`}>
      <input {...props} />
      {invalid && (
        <SVG
          className="error"
          wrapper={React.createFactory('div')}
          src={xMark}
          onLoad={() => {
            anime({
              targets: '.cross-path',
              strokeDashoffset: [anime.setDashoffset, 0],
              easing: 'easeInOutCubic',
              duration: 500,
              delay: anime.stagger(200),
              begin: function() {
                const svg = document.querySelector('.cross');
                for (const child of svg.children) {
                  child.setAttribute('stroke', '#ab0927');
                }
              },
              complete: function() {
                const svg = document.querySelector('.cross');
                for (const child of svg.children) {
                  child.setAttribute('fill', '#f7768e');
                }
              }
            });
          }}
        />
      )}
    </div>
  );
};

export default Input;
