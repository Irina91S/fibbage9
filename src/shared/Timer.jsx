import React, { useEffect } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import { useTimer } from 'react-timer-hook';

import 'react-circular-progressbar/dist/styles.css';
import './Timer.scss';

const MAX = 30;
const noop = () => {};

export const Timer = ({
  endTime,
  size = '70px',
  onTimerTick = noop,
  onTimerEnd = noop
}) => {
  const { seconds } = useTimer({
    expiryTimestamp: endTime,
    onExpire: onTimerEnd
  });

  useEffect(() => {
    const remainingTime = Math.max(0, endTime - Date.now());
    onTimerTick(remainingTime, endTime, Date.now());
  }, [seconds]);

  return (
    <div style={{ width: size, height: size }}>
      <CircularProgressbar
        text={seconds}
        value={(100 * seconds) / MAX}
        strokeWidth={12}
        counterClockwise
      />
    </div>
  );
};

export default Timer;
