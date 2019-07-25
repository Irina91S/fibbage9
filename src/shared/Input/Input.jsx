import React from 'react';
import anime from 'animejs';
import SVG from 'react-inlinesvg';
import { Field } from 'formik';

import xMark from './x-mark.svg';
import './Input.scss';

const Input = props => {
  const invalid = Object.keys(props.errors).length > 0;

  return (
    <div className={`page-transition-elem input ${invalid && 'invalid'}`}>
      <Field autocomplete="off" {...props} />
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
              duration: 300,
              delay: anime.stagger(100),
              begin: function () {
                const svg = document.querySelector('.cross');
                if (!svg) return;
                for (const child of svg.children) {
                  child.setAttribute('stroke', '#ab0927');
                }
              },
              complete: function () {
                const svg = document.querySelector('.cross');
                if (!svg) return;
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
