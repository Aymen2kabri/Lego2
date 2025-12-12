import React, { useState, useCallback } from 'react';
import { ThreeEvent, useThree } from '@react-three/fiber';
import { OrbitControls, Grid, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { BrickData, BrickType, Vector3Tuple } from '../types';
import { BRICK_DEFINITIONS, UNIT_SIZE, BRICK_HEIGHT } from '../constants';
import { Brick } from './Brick';
import { nanoid } from 'nanoid';

interface SceneProps {
  bricks: BrickData[];
  setBricks: React.Dispatch<React.SetStateAction<BrickData[]>>;
  selectedColor: string;
  selectedType: BrickType;
  rotation: number;
}

export const Scene: React.FC<SceneProps> = ({ 
  bricks, 
  setBricks, 
  selectedColor, 
  selectedType, 
  rotation 
}) => {
  const [hoverPos, setHoverPos] = useState<Vector3Tuple | null>(null);
  const { camera } = useThree();

  const handlePointerMove = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();

    if (e.intersections.length > 0) {
      const intersect = e.intersections[0];
      
      // If we didn't hit a face (unlikely but possible), ignore
      if (!intersect.face) return;

      const { point, face } = intersect;
      const normal = face.normal;

      // Calculate the "Touch Point": slightly offset from the hit point in the direction of the normal.
      // This moves us into the empty space "adjacent" to the face we hit.
      // 0.1 is a small epsilon sufficient to move into the next grid cell.
      const touchPoint = point.clone().add(normal.clone().multiplyScalar(0.1));

      // Snap X and Z to the grid unit size
      const snappedX = Math.round(touchPoint.x / UNIT_SIZE) * UNIT_SIZE;
      const snappedZ = Math.round(touchPoint.z / UNIT_SIZE) * UNIT_SIZE;

      // Snap Y to discrete brick height layers
      // Layer 0 is at y=0.6 (height/2), Layer 1 is at y=1.8, etc.
      // formula: center_y = (layer_index * height) + (height / 2)
      const layerIndex = Math.floor(touchPoint.y / BRICK_HEIGHT);
      
      // Ensure we don't go below ground (layer 0)
      const safeLayerIndex = Math.max(0, layerIndex);
      const snappedY = (safeLayerIndex * BRICK_HEIGHT) + (BRICK_HEIGHT / 2);

      setHoverPos([snappedX, snappedY, snappedZ]);
    } else {
      setHoverPos(null);
    }
  }, []);

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();

    // Check for Alt key for deletion
    if (e.altKey) {
      // Find the brick ID by traversing up to the group that has userData
      let target = e.object;
      while (target.parent && !target.userData?.id && target.parent.type !== 'Scene') {
        target = target.parent;
      }
      
      if (target.userData?.id) {
        const brickId = target.userData.id;
        setBricks((prev) => prev.filter((b) => b.id !== brickId));
      }
      return;
    }

    // Placement
    if (hoverPos) {
      const newBrick: BrickData = {
        id: nanoid(),
        type: selectedType,
        position: hoverPos,
        rotation: rotation,
        color: selectedColor,
      };
      setBricks((prev) => [...prev, newBrick]);
    }
  };

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight 
        position={[10, 20, 10]} 
        intensity={1.5} 
        castShadow 
        shadow-mapSize={[2048, 2048]} 
      />
      <Environment preset="city" />
      <OrbitControls makeDefault maxPolarAngle={Math.PI / 2.1} />

      {/* Ground Plane */}
      <mesh 
        name="ground" 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0, 0]} 
        receiveShadow
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
      >
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#222" opacity={0.5} transparent />
      </mesh>
      
      <Grid 
        infiniteGrid 
        fadeDistance={30} 
        sectionSize={1} 
        cellSize={1} 
        sectionColor="#555" 
        cellColor="#333" 
        position={[0, 0.01, 0]}
      />

      {/* Placed Bricks */}
      <group onPointerMove={handlePointerMove} onPointerDown={handlePointerDown}>
        {bricks.map((brick) => (
          <Brick
            key={brick.id}
            {...brick}
            userData={{ id: brick.id }}
          />
        ))}
      </group>

      {/* Ghost Brick - No events on ghost to prevent self-intersection issues during placement */}
      {hoverPos && (
        <group pointerEvents="none">
          <Brick
            type={selectedType}
            position={hoverPos}
            rotation={rotation}
            color={selectedColor}
            isGhost={true}
          />
        </group>
      )}
    </>
  );
};