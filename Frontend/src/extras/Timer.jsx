import { useEffect, useState } from "react";

export const Timer = ({ onTimeout }) => {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

  useEffect(() => {
    if (timeLeft <= 0) {
      if (onTimeout) onTimeout(); // Callback when timer reaches zero
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer); // Cleanup interval
  }, [timeLeft, onTimeout]);

  // Format time in MM:SS format
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="font-semibold text-gray-700 mt-2">
      Time Remaining: <span className="text-blue-600">{formatTime(timeLeft)}</span>
    </div>
  );
};
