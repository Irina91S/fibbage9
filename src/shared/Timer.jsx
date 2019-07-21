import React, { useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import useInterval from '@use-it/interval';

import 'react-circular-progressbar/dist/styles.css';
import './Timer.scss';

export const Timer = ({
  endTime,
  size = '70px',
  onTimerTick = () => { },
  onTimerEnd = () => { }
}) => {
  const isValidTime = endTime && (endTime - Date.now() > 0);
  const [secondsLeft, setLeftTime] = useState(isValidTime ? 29 : 0);

  useInterval(() => {
    const remainingTime = Math.max(0, endTime - Date.now());
    onTimerTick(remainingTime, endTime, Date.now());
    setLeftTime(new Date(remainingTime).getSeconds());

    if (endTime <= Date.now()) {
      onTimerEnd();
    }
  }, isValidTime ? 1000 : null);

return (
  <div className="timer-wrapper" style={{ width: size, height: size }}>
    <CircularProgressbar
      text={secondsLeft}
      value={100 * secondsLeft / 30}
      strokeWidth={12}
      counterClockwise
    />
  </div>
)
};

export default Timer;