import React from 'react';

import './Header.scss';

const Header = ({ title, subtitle }) => {
  return (
    <header className="header">
      <h3 className="title u-weight-light">{title}</h3>
      <div className="subtitle u-weight-lightest">{subtitle} </div>
    </header>
  );
};

export default Header;
