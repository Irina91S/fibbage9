import React from 'react';

import './Moon.scss';

const Moon = props => {
  console.log(props);
  return <div className="moon" style={{ ...props }} />;
};

export default Moon;
