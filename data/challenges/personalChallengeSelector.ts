import { PERSONAL_CHALLENGES } from "./personalChallenges";
import type { PersonalChallenge } from "./types";

const DEFAULT_COUNT = 3;

export function selectPersonalChallenges(
  count: number = DEFAULT_COUNT,
): PersonalChallenge[] {
  const pool = [...PERSONAL_CHALLENGES];

  // Fisher-Yates shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool.slice(0, Math.min(count, pool.length));
}
