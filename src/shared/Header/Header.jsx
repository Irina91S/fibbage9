import React from 'react';

import './Header.scss';

const Header = ({ title, subtitle }) => {
  return (
    <header className="header">
      <h3 className="page-transition-elem title u-weight-light">{title}</h3>
      <div className="page-transition-elem subtitle u-weight-lightest">
        {subtitle}
      </div>
    </header>
  );
};

export default Header;
