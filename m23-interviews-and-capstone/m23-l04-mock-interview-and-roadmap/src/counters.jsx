import { useState } from 'react';

export function Counters() {
  const [plain, setPlain] = useState(0);
  const [updater, setUpdater] = useState(0);

  const addPlain = () => {
    setPlain(plain + 1);
    setPlain(plain + 1);
    setPlain(plain + 1);
  };
  const addUpdater = () => {
    setUpdater(n => n + 1);
    setUpdater(n => n + 1);
    setUpdater(n => n + 1);
  };

  return (
    <div>
      <button id="plain" onClick={addPlain}>plain: {plain}</button>
      <button id="updater" onClick={addUpdater}>updater: {updater}</button>
    </div>
  );
}
