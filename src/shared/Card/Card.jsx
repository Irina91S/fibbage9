import React from 'react';

import './Card.scss';

// basic or success cards
const Card = ({ className, type = 'basic', children, ...rest }) => {
  return (
    <div
      className={`card o-box--small ${type} ${className ? className : ''}`}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Card;
