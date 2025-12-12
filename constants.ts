import { BrickType, BrickConfig } from './types';

// Standard "LEGO" unit approximation
// 1 unit width/depth = 20 standard LDU. 
// Height is usually 1.2x width ratio roughly in games.
export const UNIT_SIZE = 1;
export const BRICK_HEIGHT = 1.2;

export const COLORS = [
  { name: 'Red', value: '#ef4444' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Yellow', value: '#eab308' },
  { name: 'Green', value: '#22c55e' }, // Garden green
  { name: 'Dark Green', value: '#15803d' }, // Garden dark
  { name: 'Brown', value: '#78350f' }, // Wood/trunk
  { name: 'White', value: '#f9fafb' },
  { name: 'Grey', value: '#6b7280' },
  { name: 'Black', value: '#111827' },
];

export const BRICK_DEFINITIONS: Record<BrickType, BrickConfig> = {
  [BrickType.Square1x1]: { type: BrickType.Square1x1, width: 1, depth: 1, height: BRICK_HEIGHT, label: '1x1' },
  [BrickType.Rect1x2]:   { type: BrickType.Rect1x2,   width: 1, depth: 2, height: BRICK_HEIGHT, label: '1x2' },
  [BrickType.Rect1x4]:   { type: BrickType.Rect1x4,   width: 1, depth: 4, height: BRICK_HEIGHT, label: '1x4' },
  [BrickType.Square2x2]: { type: BrickType.Square2x2, width: 2, depth: 2, height: BRICK_HEIGHT, label: '2x2' },
  [BrickType.Rect2x4]:   { type: BrickType.Rect2x4,   width: 2, depth: 4, height: BRICK_HEIGHT, label: '2x4' },
  [BrickType.Slope2x2]:  { type: BrickType.Slope2x2,  width: 2, depth: 2, height: BRICK_HEIGHT, label: 'Roof' },
  [BrickType.Cylinder]:  { type: BrickType.Cylinder,  width: 1, depth: 1, height: BRICK_HEIGHT, label: 'Pole' },
};