import { useEffect } from 'react';

export function Clock() {
  useEffect(() => {
    console.log('effect: start the timer');
    const id = setInterval(() => {}, 1000);
    return () => {
      console.log('cleanup: stop the timer');
      clearInterval(id);
    };
  }, []);
  return <p>tick</p>;
}
