import type { Season } from "./typesDtos";

export type StudentFilter = {
  name?: string;
  groupId?: number;
  onlyUnpaid?: boolean;
  absentMoreThan?: number;
  includeInactive?: boolean;
  page: number;
  pageSize: number;
};
export type GroupFilter = {
  name?: string;
  season?: Season;
  year?: number;
  isActive?: boolean;
  page: number;
  pageSize: number;
};