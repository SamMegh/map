import { useState } from 'react';
import { Filter, Eye, EyeOff, Building2, Bomb, CloudFog, Zap, Flame, ChevronRight, ChevronLeft, Bold } from 'lucide-react';
import { TokenType } from '../types';
import { Tooltip } from './Tooltip';

interface SidebarRightProps {
  color: string;
  setColor: (color: string) => void;
  showAttackers: boolean;
  setShowAttackers: (show: boolean) => void;
  showDefenders: boolean;
  setShowDefenders: (show: boolean) => void;
  showObjectives: boolean;
  setShowObjectives: (show: boolean) => void;
  showMapObjectives: boolean;
  setShowMapObjectives: (show: boolean) => void;
  showLines: boolean;
  setShowLines: (show: boolean) => void;
  gameMode?: string;
}

const COLORS = [
  '#ef4444', // Red
  '#3b82f6', // Blue
];

export function SidebarRight({
  color,
  setColor,
  showAttackers,
  setShowAttackers,
  showDefenders,
  setShowDefenders,
  showObjectives,
  setShowObjectives,
  showMapObjectives,
  setShowMapObjectives,
  showLines,
  setShowLines,
  gameMode
}: SidebarRightProps) {
  const [isMinimized, setIsMinimized] = useState(false);

  const onDragStart = (e: React.DragEvent, type: TokenType) => {
    e.dataTransfer.setData('tokenType', type);
    e.dataTransfer.setData('color', color);
  };

  return (
    <div className={`absolute top-14 right-4 bottom-14 place-self-center h-fit flex flex-col gap-4 z-10 items-end transition-all duration-300 ${isMinimized ? 'translate-x-[calc(100%-48px)]' : 'translate-x-0'}`}>
      <div className="bg-white/95 dark:bg-neutral-900/95 backdrop-blur border border-neutral-200 dark:border-neutral-800 rounded-lg p-2 shadow-xl flex flex-col gap-2 pointer-events-auto">
        <button 
          onClick={() => setIsMinimized(!isMinimized)}
          className="p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 mx-auto"
        >
          {isMinimized ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
        
        {!isMinimized && <>
        <Tooltip content="Toggle Drawings" side="left">
          <button onClick={() => setShowLines(!showLines)} className={`p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 ${showLines ? 'text-blue-500' : 'text-neutral-400'}`}>
            <Filter className="w-5 h-5" />
          </button>
        </Tooltip>
        
        <div className="w-full h-px bg-neutral-200 dark:bg-neutral-800"></div>
        
        <div className="flex flex-col gap-2 w-full items-center">
          <Tooltip content="Toggle Attackers" side="left">
            <button onClick={() => setShowAttackers(!showAttackers)} className="p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-red-600">
              {showAttackers ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </Tooltip>
          <Tooltip content="Toggle Defenders" side="left">
            <button onClick={() => setShowDefenders(!showDefenders)} className="p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-blue-600">
              {showDefenders ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </Tooltip>
          <Tooltip content="Toggle Tokens" side="left">
            <button onClick={() => setShowObjectives(!showObjectives)} className="p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
              {showObjectives ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </Tooltip>
        </div>
        
        <div className="w-full h-px bg-neutral-200 dark:bg-neutral-800"></div>
        
        <div className="flex flex-col gap-2">
          {COLORS.map((c) => (
            <Tooltip content="Pick Color" side="left" key={c}>
              <button
                onClick={() => setColor(c)}
                className={`w-5 h-5 rounded-md border ${
                  color === c ? 'ring-2 ring-offset-2 ring-neutral-400 dark:ring-offset-neutral-900 border-neutral-400' : 'border-neutral-300 dark:border-neutral-700'
                }`}
                style={{ backgroundColor: c }}
              />
            </Tooltip>
          ))}
        </div>
        
        <div className="w-full h-px bg-neutral-200 dark:bg-neutral-800"></div>
        
        <div className="flex flex-col gap-1 w-full items-center">
          <Tooltip content="Attacker" side="left">
            <div 
              draggable 
              onDragStart={(e) => onDragStart(e, 'attacker')}
              className="w-6 h-6 flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded p-1"
            >
              <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[12px] border-l-transparent border-r-transparent border-t-red-600 drop-shadow-md"></div>
            </div>
          </Tooltip>
          
          <Tooltip content="Defender" side="left">
            <div 
              draggable 
              onDragStart={(e) => onDragStart(e, 'defender')}
              className="w-6 h-6 flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded p-1"
            >
              <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-b-[12px] border-l-transparent border-r-transparent border-b-blue-600 drop-shadow-md"></div>
            </div>
          </Tooltip>
          
          <Tooltip content="Choke point" side="left">
            <div 
              draggable 
              onDragStart={(e) => onDragStart(e, 'choke')}
              className="w-6 h-6 flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded p-1"
            >
              <div className="w-5 h-5 rounded-full bg-white border-2 border-black flex items-center justify-center shadow-md">
                <span className="text-[10px] font-bold text-black">1</span>
              </div>
            </div>
          </Tooltip>
          
          <Tooltip content="Dot" side="left">
            <div 
              draggable 
              onDragStart={(e) => onDragStart(e, 'dot')}
              className="w-6 h-6 flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded p-1"
            >
              <div className="w-3 h-3 rounded-full bg-white border border-black shadow-md"></div>
            </div>
          </Tooltip>
          
          <Tooltip content="Square" side="left">
            <div 
              draggable 
              onDragStart={(e) => onDragStart(e, 'square')}
              className="w-6 h-6 flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded p-1"
            >
              <div className="w-4 h-4 bg-white border-2 border-black shadow-md"></div>
            </div>
          </Tooltip>
          
          <Tooltip content="Skull / Danger" side="left">
            <div 
              draggable 
              onDragStart={(e) => onDragStart(e, 'skull')}
              className="w-6 h-6 flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded p-1"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="white" strokeLinecap="round" strokeLinejoin="round" className="text-black drop-shadow-md">
                <circle cx="9" cy="12" r="1"></circle>
                <circle cx="15" cy="12" r="1"></circle>
                <path d="M8 20v2h8v-2"></path>
                <path d="m12.5 17-.5-1-.5 1h1z"></path>
                <path d="M16 20a2 2 0 0 0 1.56-3.25 8 8 0 1 0-11.12 0A2 2 0 0 0 8 20"></path>
              </svg>
            </div>
          </Tooltip>
          
          <Tooltip content="Sports Player" side="left">
            <div 
              draggable 
              onDragStart={(e) => onDragStart(e, 'sports_player')}
              className="w-6 h-6 flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded "
            >
              <Bold className="w-5 h-5 text-white bg-red-600 drop-shadow-md text-sm border-2 border-red-700 font-extrabold" />
            </div>
          </Tooltip>

          {gameMode === 'LINEUPS' && (
            <>
              <div className="w-full h-px bg-neutral-200 dark:bg-neutral-800 my-1"></div>
              
              <Tooltip content="Grenade" side="left">
                <div 
                  draggable 
                  onDragStart={(e) => onDragStart(e, 'grenade')}
                  className="w-6 h-6 flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded p-1 text-green-500"
                >
                  <Bomb className="w-5 h-5 drop-shadow-md" />
                </div>
              </Tooltip>
              <Tooltip content="Smoke" side="left">
                <div 
                  draggable 
                  onDragStart={(e) => onDragStart(e, 'smoke')}
                  className="w-6 h-6 flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded p-1 text-gray-400"
                >
                  <CloudFog className="w-5 h-5 drop-shadow-md" />
                </div>
              </Tooltip>
              <Tooltip content="Flash" side="left">
                <div 
                  draggable 
                  onDragStart={(e) => onDragStart(e, 'flash')}
                  className="w-6 h-6 flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded p-1 text-yellow-400"
                >
                  <Zap className="w-5 h-5 drop-shadow-md" />
                </div>
              </Tooltip>
              <Tooltip content="Molotov" side="left">
                <div 
                  draggable 
                  onDragStart={(e) => onDragStart(e, 'molotov')}
                  className="w-6 h-6 flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded p-1 text-orange-500"
                >
                  <Flame className="w-5 h-5 drop-shadow-md" />
                </div>
              </Tooltip>
            </>
          )}
        </div>
        <div className="w-full h-px bg-neutral-200 dark:bg-neutral-800 my-1"></div>
        
        <Tooltip content="Toggle Map Objectives" side="left">
          <button 
            onClick={() => setShowMapObjectives(!showMapObjectives)}
            className={`p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 ${showMapObjectives ? 'text-amber-500' : 'text-neutral-400'}`}
          >
            <Building2 className="w-5 h-5" />
          </button>
        </Tooltip>
        </>}
      </div>
    </div>
  );
}
