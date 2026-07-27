import type { ElectionConfig } from "../../config/election";

export type CountdownValue = {
  days: number;
  hours: number;
  minutes: number;
  completed: boolean;
};

export function calculateCountdown(
  election: ElectionConfig,
  now: Date = new Date(),
): CountdownValue {
  const target = new Date(election.electionDateTime).getTime();
  const remaining = Math.max(0, target - now.getTime());
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;

  return {
    days: Math.floor(remaining / day),
    hours: Math.floor((remaining % day) / hour),
    minutes: Math.floor((remaining % hour) / minute),
    completed: remaining === 0,
  };
}

export function countdownStorageKey(election: ElectionConfig): string {
  return `countdown-dismissed:${election.electionDate}`;
}
