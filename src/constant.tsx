export const YES = "★";
export const NO = "•";

export const PURPLE = "purple";
export const RED = "red";
export const ORANGE = "orange";
export const BLUE = "blue";
export const GREEN = "green";
export const YELLOW = "yellow";
export const GRAY = "gray";
export const TURQUOISE = "turquoise";
export const BROWN = "brown";
export const PINK = "pink";

export const COLOR_OPTIONS = [
  PURPLE,
  RED,
  ORANGE,
  BLUE,
  GREEN,
  YELLOW,
  GRAY,
  TURQUOISE,
  BROWN,
  PINK,
];

export const COLOR_TO_CODE_MAPPING: Record<string, string> = {
  [PURPLE]: "#BBA2E2",
  [RED]: "#FE7A61",
  [ORANGE]: "#FFC995",
  [BLUE]: "#96BDFF",
  [GREEN]: "#B3DFA0",
  [YELLOW]: "#E5F387",
  [GRAY]: "#E0E0E0",
  [TURQUOISE]: "#A3D2D8",
  [BROWN]: "#AFAA95",
  [PINK]: "#DE9FBF",
};

export function getColorCode(color: string | null | undefined) {
  if (color === null || color === undefined) {
    return "#FFFFFF"; // white
  }
  return COLOR_TO_CODE_MAPPING[color];
}
