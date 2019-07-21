import React from 'react';
import './Card.scss';

// basic or success cards
const Card = ({ className, disabled, type = 'basic', children, ...rest }) => {
  return (
    <React.Fragment>
      <div
        className={`card o-box--small ${type} ${disabled ? 'disabled' : ''}  ${className ? className : ''}`}
        {...rest}
      >
        {children}
      </div>
    </React.Fragment> 
  );
};

export default Card;
