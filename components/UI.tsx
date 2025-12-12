import React from 'react';
import { BrickType, GameState } from '../types';
import { COLORS, BRICK_DEFINITIONS } from '../constants';
import { Trash2, RotateCw, Box } from 'lucide-react';

interface UIProps {
  selectedColor: string;
  setSelectedColor: (c: string) => void;
  selectedType: BrickType;
  setSelectedType: (t: BrickType) => void;
  handleRotate: () => void;
  handleClear: () => void;
}

export const UI: React.FC<UIProps> = ({
  selectedColor,
  setSelectedColor,
  selectedType,
  setSelectedType,
  handleRotate,
  handleClear,
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 z-10">
      
      {/* Header */}
      <div className="flex justify-between items-start pointer-events-auto">
        <div className="bg-black/60 backdrop-blur-md p-4 rounded-xl text-white border border-white/10 shadow-xl">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
            BrickMaster 3D
          </h1>
          <p className="text-xs text-gray-300 mt-1">
            Left Click: Place • Alt + Click: Remove • Right Click: Rotate Cam
          </p>
        </div>
        
        <div className="flex gap-2">
           <button
            onClick={handleClear}
            className="bg-red-500/80 hover:bg-red-600 text-white p-3 rounded-lg shadow-lg backdrop-blur transition-all active:scale-95"
            title="Clear All"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="flex flex-col gap-4 pointer-events-auto items-center">
        
        {/* Brick Types */}
        <div className="bg-black/60 backdrop-blur-md p-3 rounded-xl border border-white/10 shadow-xl overflow-x-auto max-w-full flex gap-2">
           {Object.values(BRICK_DEFINITIONS).map((def) => (
             <button
               key={def.type}
               onClick={() => setSelectedType(def.type)}
               className={`
                 flex flex-col items-center justify-center min-w-[60px] p-2 rounded-lg transition-all border
                 ${selectedType === def.type 
                   ? 'bg-blue-600/80 border-blue-400 scale-105' 
                   : 'bg-white/5 border-transparent hover:bg-white/10 text-gray-400'}
               `}
             >
               <Box size={24} className={selectedType === def.type ? 'text-white' : 'text-gray-400'} />
               <span className="text-[10px] font-bold mt-1 text-white">{def.label}</span>
             </button>
           ))}
        </div>

        {/* Color Palette & Actions */}
        <div className="flex gap-4 items-center">
          <div className="bg-black/60 backdrop-blur-md p-3 rounded-xl border border-white/10 shadow-xl flex gap-2">
            {COLORS.map((c) => (
              <button
                key={c.name}
                onClick={() => setSelectedColor(c.value)}
                className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 shadow-sm ${
                  selectedColor === c.value ? 'border-white scale-110' : 'border-transparent opacity-80'
                }`}
                style={{ backgroundColor: c.value }}
                title={c.name}
              />
            ))}
          </div>
          
          <button
            onClick={handleRotate}
            className="bg-black/60 backdrop-blur-md hover:bg-blue-600/80 text-white p-4 rounded-full border border-white/10 shadow-xl transition-all active:scale-95 active:rotate-90"
            title="Rotate Brick (R)"
          >
            <RotateCw size={24} />
          </button>
        </div>

      </div>
    </div>
  );
};