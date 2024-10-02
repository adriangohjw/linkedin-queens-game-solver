import {
  PURPLE,
  RED,
  ORANGE,
  BLUE,
  GREEN,
  YELLOW,
  GRAY,
  BROWN,
  PINK,
} from "./constant";

const INITIAL_PUZZLE_COLOR = [
  [PURPLE, PURPLE, ORANGE, ORANGE, ORANGE, BLUE, BLUE, BLUE],
  [PURPLE, ORANGE, ORANGE, ORANGE, ORANGE, ORANGE, BLUE, BLUE],
  [ORANGE, ORANGE, ORANGE, ORANGE, ORANGE, ORANGE, ORANGE, ORANGE],
  [ORANGE, GREEN, GRAY, GRAY, GRAY, GRAY, GREEN, ORANGE],
  [ORANGE, GREEN, GRAY, GRAY, RED, RED, GREEN, YELLOW],
  [ORANGE, GREEN, GRAY, GRAY, GRAY, GRAY, GREEN, YELLOW],
  [BROWN, GREEN, GRAY, GRAY, GRAY, GRAY, GREEN, YELLOW],
  [BROWN, GREEN, GREEN, GREEN, GREEN, GREEN, GREEN, YELLOW],
];

export default INITIAL_PUZZLE_COLOR;
