import { YES, NO, COLOR_OPTIONS } from "./constant";

export type ColorType = (typeof COLOR_OPTIONS)[number] | null;
export type CellType = { row: number; col: number };
export type CellContentType = typeof YES | typeof NO | null;
