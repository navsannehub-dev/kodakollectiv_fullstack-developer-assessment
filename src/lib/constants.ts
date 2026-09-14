export const STATUSES = ["Planning", "In Progress", "On Hold", "Completed"] as const;
export const PRIORITIES = ["Low", "Medium", "High"] as const;

export type Status = (typeof STATUSES)[number];
export type Priority = (typeof PRIORITIES)[number];
