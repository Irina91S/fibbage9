import React from 'react';

import './Moon.scss';

const Moon = props => {
  console.log(props);
  return (
    <div className="moon" style={{ ...props }}>
      <span className="crater big" style={{ top: 25, right: 50 }} />
      <span className="crater medium" style={{ top: 15, right: 15 }} />
      <span className="crater medium" style={{ top: 60, right: 30 }} />
      <span className="crater small" style={{ top: 15, right: 40 }} />
      <span className="crater small" style={{ top: 55, right: 15 }} />
      <span className="crater small" style={{ top: 40, right: 35 }} />
      <span className="crater small" style={{ top: 65, right: 55 }} />
    </div>
  );
};

export default Moon;
