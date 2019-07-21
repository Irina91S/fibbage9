import React, { useEffect } from 'react';
import anime from 'animejs';
import './Footer.scss';

// Children must contain a image that points to a svg
// That image must have the clas of 'footer-image'

const Footer = ({ children }) => {
  useEffect(() => {
    // When the page first loads, set the position of the image
    // so that it will not be pushed up when opening keyboard on phone
    const container = document.querySelector('.footer-container');
    const footerImage = document.querySelector('.footer-image');
    container.style.top = `0`;
    container.style.marginTop = `${window.innerHeight - footerImage.clientHeight}px`;
    container.style.height = `${footerImage.clientHeight}px`;

      anime({
        targets: 'img',
        opacity: 1,
        easing: 'easeInOutQuint',
        duration: 2000
      });
  }, []);

  return (
    <div className="footer-container o-layout--stretch o-layout--center">
      {children}
    </div>
  );
};

export default Footer;
