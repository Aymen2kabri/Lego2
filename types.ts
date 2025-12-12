export type Vector3Tuple = [number, number, number];

export enum BrickType {
  Square1x1 = '1x1',
  Square2x2 = '2x2',
  Rect2x4 = '2x4',
  Rect1x2 = '1x2',
  Rect1x4 = '1x4',
  Slope2x2 = 'slope2x2',
  Cylinder = 'cylinder',
}

export interface BrickData {
  id: string;
  type: BrickType;
  position: Vector3Tuple;
  rotation: number; // Y-axis rotation in radians
  color: string;
}

export interface BrickConfig {
  type: BrickType;
  width: number; // X size (in logical grid units)
  depth: number; // Z size (in logical grid units)
  height: number; // Y size (standard is 1.2)
  label: string;
}

export interface GameState {
  bricks: BrickData[];
  selectedColor: string;
  selectedType: BrickType;
  isRotating: boolean; // simple toggle state for UI
}