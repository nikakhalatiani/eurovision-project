export const EUROVISION_2026 = {
  firstSemiStart: "2026-05-12T19:00:00Z",
  firstSemiResults: "2026-05-13T04:00:00Z",
  secondSemiStart: "2026-05-14T19:00:00Z",
  secondSemiResults: "2026-05-15T04:00:00Z",
  finalPreview: "2026-05-15T19:00:00Z",
  finalStart: "2026-05-16T19:00:00Z",
  finalResults: "2026-05-17T06:00:00Z",
} as const;

export const getContestTime = (key: keyof typeof EUROVISION_2026) =>
  new Date(EUROVISION_2026[key]);

export const getContestTimestamp = (key: keyof typeof EUROVISION_2026) =>
  getContestTime(key).getTime();
