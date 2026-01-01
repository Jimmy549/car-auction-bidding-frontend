"use client";

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  endTime: string | Date;
  onExpire?: () => void;
}

export function CountdownTimer({ endTime, onExpire }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const end = new Date(endTime).getTime();
      const difference = end - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        if (onExpire) onExpire();
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endTime, onExpire]);

  const formatTime = (time: number) => time.toString().padStart(2, '0');

  if (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) {
    return <span className="text-red-500 font-medium">Ended</span>;
  }

  return (
    <div className="flex items-center gap-1 text-sm">
      {timeLeft.days > 0 && (
        <>
          <span className="font-mono">{timeLeft.days}d</span>
          <span>:</span>
        </>
      )}
      <span className="font-mono">{formatTime(timeLeft.hours)}</span>
      <span>:</span>
      <span className="font-mono">{formatTime(timeLeft.minutes)}</span>
      <span>:</span>
      <span className="font-mono">{formatTime(timeLeft.seconds)}</span>
    </div>
  );
}