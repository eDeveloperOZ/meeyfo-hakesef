"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { election } from "../../config/election";
import { calculateCountdown, countdownStorageKey } from "../lib/countdown";

export function CountdownBanner() {
  const [countdown, setCountdown] = useState(() => calculateCountdown(election));
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(localStorage.getItem(countdownStorageKey(election)) !== "true");
    const interval = window.setInterval(() => setCountdown(calculateCountdown(election)), 60_000);
    return () => window.clearInterval(interval);
  }, []);

  if (!visible) return null;

  return (
    <section className="countdown-banner" aria-labelledby="countdown-title">
      <button
        className="icon-button"
        type="button"
        aria-label="סגירת ספירת הימים לבחירות"
        onClick={() => {
          localStorage.setItem(countdownStorageKey(election), "true");
          setVisible(false);
        }}
      >
        <X aria-hidden="true" size={20} />
      </button>
      <div>
        <p id="countdown-title" className="countdown-eyebrow">
          {election.displayNameHe}
        </p>
        {countdown.completed ? (
          <p className="countdown-value">יום הבחירות הגיע</p>
        ) : (
          <p className="countdown-value">
            עוד <strong>{countdown.days}</strong> ימים, {countdown.hours} שעות ו־
            {countdown.minutes} דקות
          </p>
        )}
        <p>{election.electionDateDisplayHe}. האתר מרכז מידע למחזור הבחירות הזה.</p>
      </div>
    </section>
  );
}
