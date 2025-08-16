
import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  targetDate: string;
}

const CountdownTimer = ({ targetDate }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-4 sm:p-6 rounded-xl">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <Clock size={24} />
        <h3 className="text-base sm:text-xl font-bold">Tiempo restante para el sorteo</h3>
      </div>
      <div className="grid grid-cols-4 gap-2 sm:gap-4">
        <div className="text-center">
          <div className="text-2xl sm:text-3xl font-bold">{timeLeft.days}</div>
          <div className="text-xs sm:text-sm opacity-90">Días</div>
        </div>
        <div className="text-center">
          <div className="text-2xl sm:text-3xl font-bold">{timeLeft.hours}</div>
          <div className="text-xs sm:text-sm opacity-90">Horas</div>
        </div>
        <div className="text-center">
          <div className="text-2xl sm:text-3xl font-bold">{timeLeft.minutes}</div>
          <div className="text-xs sm:text-sm opacity-90">Min</div>
        </div>
        <div className="text-center">
          <div className="text-2xl sm:text-3xl font-bold">{timeLeft.seconds}</div>
          <div className="text-xs sm:text-sm opacity-90">Seg</div>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
