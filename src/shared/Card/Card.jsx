import React, { useRef, useState, useEffect } from 'react';
import './Card.scss';

// basic or success cards
const Card = ({ className, disabled, type = 'basic', hasBg, children, ...rest }) => {
  const [ bgColor, setBgColor ] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    if (hasBg && ref.current) {
      setTimeout(() => {
        setBgColor(ref.current.style.color);
      }, 100);
    }
  }, []);

  return (
    <React.Fragment>
      <div
        ref={ref}
        className={`card o-box--small ${type} ${
          disabled ? 'disabled' : ''
        }  ${className ? className : ''}`}
        {...rest}
      >
        {hasBg && (
          <div className="card-bg" style={{ backgroundColor: bgColor }} />
        )}
        {children}
      </div>
    </React.Fragment>
  );
};

export default Card;
