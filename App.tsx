import React, { useState, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Scene } from './components/Scene';
import { UI } from './components/UI';
import { BrickData, BrickType } from './types';
import { COLORS } from './constants';

const App: React.FC = () => {
  const [bricks, setBricks] = useState<BrickData[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>(COLORS[0].value);
  const [selectedType, setSelectedType] = useState<BrickType>(BrickType.Square2x2);
  const [rotation, setRotation] = useState<number>(0);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'r') {
        setRotation((prev) => prev + Math.PI / 2);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClear = useCallback(() => {
    if (window.confirm("Are you sure you want to delete your masterpiece?")) {
      setBricks([]);
    }
  }, []);

  const handleRotate = useCallback(() => {
    setRotation((prev) => prev + Math.PI / 2);
  }, []);

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-gray-900 to-gray-800">
      <UI 
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        handleRotate={handleRotate}
        handleClear={handleClear}
      />
      
      <Canvas shadows camera={{ position: [10, 10, 10], fov: 45 }}>
        <Scene 
          bricks={bricks} 
          setBricks={setBricks}
          selectedColor={selectedColor}
          selectedType={selectedType}
          rotation={rotation}
        />
      </Canvas>
    </div>
  );
};

export default App;