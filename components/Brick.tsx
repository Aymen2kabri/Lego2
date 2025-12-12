import React, { useMemo } from 'react';
import { Vector3Tuple, BrickType } from '../types';
import { BRICK_DEFINITIONS, UNIT_SIZE } from '../constants';
import { Studs } from './Studs';
import * as THREE from 'three';

interface BrickProps {
  type: BrickType;
  position: Vector3Tuple;
  rotation: number;
  color: string;
  isGhost?: boolean;
  userData?: any;
}

export const Brick: React.FC<BrickProps> = ({ type, position, rotation, color, isGhost = false, userData }) => {
  const config = BRICK_DEFINITIONS[type];
  
  // Calculate visual geometry dimensions
  const width = config.width * UNIT_SIZE;
  const depth = config.depth * UNIT_SIZE;
  const height = config.height;

  // Material setup
  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.2,
      metalness: 0.1,
      transparent: isGhost,
      opacity: isGhost ? 0.5 : 1,
    });
  }, [color, isGhost]);

  // Geometry specific rendering
  const renderGeometry = () => {
    if (type === BrickType.Cylinder) {
      return (
        <group>
          <mesh castShadow receiveShadow material={material}>
            <cylinderGeometry args={[width / 2, width / 2, height, 32]} />
          </mesh>
          {!isGhost && <Studs width={1} depth={1} color={color} />} 
        </group>
      );
    }

    if (type === BrickType.Slope2x2) {
      // Define the side profile shape (Triangle/Wedge)
      const geometry = useMemo(() => {
        const shape = new THREE.Shape();
        // Draw the side profile centered on Y
        shape.moveTo(-depth / 2, -height / 2);
        shape.lineTo(depth / 2, -height / 2);
        shape.lineTo(depth / 2, height / 2);
        // shape.lineTo(-depth / 2, -height / 2); // Simple wedge
        // Or with the top cut-off for the "lego" slope look:
        shape.lineTo(-depth / 2 + 0.2, -height / 2); 
        
        const extrudeSettings = { depth: width, bevelEnabled: false };
        const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        
        // Center the geometry
        // Extrusion goes from Z=0 to Z=depth(width). We need to shift it to -width/2 to width/2
        geo.center(); 
        return geo;
      }, [depth, height, width]);

      return (
        <group>
           {/* Rotate so extrusion axis (Z) matches the brick width axis (X) roughly, or just fit the logic */}
           <mesh castShadow receiveShadow material={material} geometry={geometry} rotation={[0, -Math.PI / 2, 0]} />
        </group>
      );
    }

    // Standard Block
    return (
      <group>
        <mesh castShadow receiveShadow material={material}>
          <boxGeometry args={[width, height, depth]} />
        </mesh>
        {!isGhost && <Studs width={config.width} depth={config.depth} color={color} />}
      </group>
    );
  };

  return (
    <group position={new THREE.Vector3(...position)} rotation={[0, rotation, 0]} userData={userData}>
      {renderGeometry()}
    </group>
  );
};