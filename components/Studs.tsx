import React, { useMemo } from 'react';
import * as THREE from 'three';
import { UNIT_SIZE } from '../constants';

interface StudsProps {
  width: number;
  depth: number;
  color: string;
}

export const Studs: React.FC<StudsProps> = ({ width, depth, color }) => {
  const studs = useMemo(() => {
    const coords: [number, number, number][] = [];
    // Calculate offsets to center studs on the brick surface
    const offsetX = (width * UNIT_SIZE) / 2 - UNIT_SIZE / 2;
    const offsetZ = (depth * UNIT_SIZE) / 2 - UNIT_SIZE / 2;

    for (let x = 0; x < width; x++) {
      for (let z = 0; z < depth; z++) {
        coords.push([
          x * UNIT_SIZE - offsetX,
          0.1, // Slightly above the brick top
          z * UNIT_SIZE - offsetZ
        ]);
      }
    }
    return coords;
  }, [width, depth]);

  return (
    // raycast={() => null} ensures the raycaster ignores these studs
    // This allows the user to click "through" the studs onto the main brick surface for cleaner placement math
    <instancedMesh args={[undefined, undefined, studs.length]} castShadow receiveShadow raycast={() => null}>
      <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
      <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
      {studs.map((pos, i) => (
        <group key={i} position={new THREE.Vector3(...pos)} />
      ))}
    </instancedMesh>
  );
};