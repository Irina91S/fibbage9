import React, { useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './Timer.scss';

export const Timer = ({
  endTime,
  size = '70px',
  onTimerTick = () => {},
  onTimerEnd = () => {}
}) => {
  const [progress, setProgress] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);

  const timeout = setInterval(() => {
    const remainingTime = Math.max(0, endTime - Date.now());
    onTimerTick(remainingTime, endTime, Date.now());
    setTime(remainingTime);
    if (endTime <= Date.now()) {
      onTimerEnd();
      clearInterval(timeout);
    }
  }, 1000);

  const setTime = remainingTime => {
    setSecondsLeft(Math.ceil(remainingTime / 1000));
    setProgress(Math.ceil(remainingTime / 30 / 10));
  };

  return (
    <div style={{ width: size, height: size }}>
      <CircularProgressbar
        text={secondsLeft}
        value={progress}
        strokeWidth={12}
        counterClockwise
      />
    </div>
  );
};

export default Timer;
