import { useState } from 'react';
import {
  MousePointer2,
  Pen,
  Eraser,
  ArrowUpRight,
  Waypoints,
  Square,
  Circle,
  Type,
  Image as ImageIcon,
  Mic,
  Unlock,
  Lock,
  Trash2,
  Ruler,
  Palette
} from 'lucide-react';
import { Tooltip } from './Tooltip';
import { ToolType, TokenData, LineData } from '../types';

const COLORS = [
  '#ef4444', // Red
  '#f97316', // Orange
  '#eab308', // Yellow
  '#22c55e', // Green
  '#3b82f6', // Blue
  '#a855f7', // Purple
  '#ec4899', // Pink
  '#14b8a6', // Teal
  '#9ca3af', // Gray
  '#4ade80', // Light Green
  '#ffffff', // White
  '#000000', // Black
];


interface SidebarLeftProps {
  activeTool: ToolType;
  setActiveTool: (tool: ToolType) => void;
  selectedToken?: TokenData;
  selectedLine?: LineData;
  selectedItemIds: string[];
  updateToken: (id: string, updates: Partial<TokenData>) => void;
  updateLine: (id: string, updates: Partial<LineData>) => void;
  deleteItem: (id: string | string[]) => void;
  isLocked: boolean;
  setIsLocked: (locked: boolean) => void;
  color: string;
  setColor: (color: string) => void;
}

export function SidebarLeft({ activeTool, setActiveTool, selectedToken, selectedLine, selectedItemIds, updateToken, updateLine, deleteItem, isLocked, setIsLocked, color, setColor }: SidebarLeftProps) {
  const [isMinimized, setIsMinimized] = useState(false);

  const ColorPicker = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => (
    <div className="flex flex-wrap gap-2">
      {COLORS.map((c) => (
        <Tooltip content="Pick Color" side="top" key={c}>
          <button
            onClick={() => onChange(c)}
            className={`w-6 h-6 rounded-md border ${
              value === c ? 'ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-neutral-900 border-blue-500' : 'border-neutral-300 dark:border-neutral-700'
            }`}
            style={{ backgroundColor: c }}
          />
        </Tooltip>
      ))}
      <Tooltip content="Custom Color" side="top">
        <label className="cursor-pointer w-6 h-6 rounded-md border border-neutral-300 dark:border-neutral-700 flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors overflow-hidden relative">
          <Palette className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
          <input 
            type="color" 
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute opacity-0 w-8 h-8 cursor-pointer"
          />
        </label>
      </Tooltip>
    </div>
  );

    const Button = ({ tool, icon: Icon, shortcut }: { tool: ToolType, icon: any, shortcut?: string }) => {
    let title = tool.charAt(0).toUpperCase() + tool.slice(1);
    return (
        <button
          onClick={() => setActiveTool(tool)}
          title={shortcut ? `${title} (${shortcut})` : title}
          className={`group/btn relative w-12 h-10 flex flex-col items-center justify-center rounded-md transition-all ${
            activeTool === tool
              ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 ring-2 ring-blue-500'
              : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
          }`}
        >
          <Icon className="w-4 h-4 group-hover/btn:-translate-y-1.5 transition-transform duration-200" />
          <span className="absolute bottom-1 text-[8px] font-bold opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200 whitespace-nowrap text-center px-0.5 leading-none pointer-events-none">
            {title}
          </span>
        </button>
    );
  };

  return (
    <div className="absolute left-2 top-14 h-fit place-self-center z-20 pointer-events-auto bottom-14 flex gap-2">
      <div className="flex flex-col gap-1 p-1 py-4 bg-white/90 dark:bg-neutral-900/90 backdrop-blur rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-sm w-14 items-center no-scrollbar">
      
        {!isMinimized && <>
        <Button tool="select" icon={MousePointer2} shortcut="S" />
        <Button tool="pen" icon={Pen} shortcut="P" />
        <Button tool="eraser" icon={Eraser} shortcut="E" />
        
        <div className="w-full h-px bg-neutral-200 dark:bg-neutral-800 my-1"></div>
        
        <Button tool="arrow" icon={ArrowUpRight} shortcut="A" />
        <Button tool="polygon" icon={Waypoints} />
        <Button tool="square" icon={Square} />
        <Button tool="circle" icon={Circle} />
        <Button tool="text" icon={Type} shortcut="T" />
        
        <Button tool="ruler" icon={Ruler} shortcut="R" />
        
        <div className="w-full h-px bg-neutral-200 dark:bg-neutral-800 my-1"></div>
        
        <Tooltip content={isLocked ? "Unlock Canvas" : "Lock Canvas"} side="right"><button onClick={() => setIsLocked(!isLocked)}>{isLocked ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}</button></Tooltip>        </>}
      </div>

      {!isMinimized && selectedItemIds && selectedItemIds.length > 1 && (
        <div className="w-48 h-fit place-self-center bg-white/95 dark:bg-neutral-900/95 backdrop-blur border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 shadow-xl flex flex-col gap-4 no-scrollbar">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-neutral-900 dark:text-white uppercase tracking-wider">{selectedItemIds.length} Items</h3>
            <Tooltip content="Delete All" side="right">
              <button 
                onClick={() => {
                  deleteItem(selectedItemIds);
                }}
                className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 rounded-md transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </Tooltip>
          </div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400 italic mb-2">Multiple items selected.</div>
          <div>
            <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 block mb-1">Color</label>
            <ColorPicker value={color} onChange={setColor} />
          </div>
        </div>
      )}
      {!isMinimized && !selectedToken && !selectedLine && (!selectedItemIds || selectedItemIds.length <= 1) && (
        <div className="w-48 h-fit place-self-center bg-white/95 dark:bg-neutral-900/95 backdrop-blur border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 shadow-xl flex flex-col gap-4 no-scrollbar">
          <h3 className="font-bold text-sm text-neutral-900 dark:text-white uppercase tracking-wider">Drawing Color</h3>
          <div>
            <ColorPicker value={color} onChange={setColor} />
          </div>
        </div>
      )}
      {!isMinimized && (selectedToken || selectedLine) && (
        <div className="w-64 h-fit place-self-center bg-white/95 dark:bg-neutral-900/95 backdrop-blur border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 shadow-xl flex flex-col gap-4 no-scrollbar">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-neutral-900 dark:text-white uppercase tracking-wider">Properties</h3>
            <button 
              onClick={() => {
                if (selectedToken) deleteItem(selectedToken.id);
                else if (selectedLine) deleteItem(selectedLine.id);
              }}
              className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 rounded-md transition-colors"
              title="Delete Selected"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {selectedToken && (
              <>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 block">Label / Text</label>
                    <Tooltip content="Text Fill Color" side="right">
<label className="cursor-pointer flex items-center justify-center w-5 h-5 rounded border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800" >
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedToken.textFill || '#000' }}></div>
                      <input 
                        type="color" 
                        value={selectedToken.textFill || '#000'}
                        onChange={(e) => updateToken(selectedToken.id, { textFill: e.target.value })}
                        className="absolute opacity-0 w-5 h-5 cursor-pointer"
                      />
                    </label>
</Tooltip>
                  </div>
                  <input 
                    type="text" 
                    value={selectedToken.label || ''}
                    onChange={e => updateToken(selectedToken.id, { label: e.target.value })}
                    className="w-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded p-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-white"
                    placeholder="Callout name..."
                  />
                </div>
                
                {(selectedToken.type === 'grenade' || selectedToken.type === 'smoke' || selectedToken.type === 'flash' || selectedToken.type === 'molotov') && (
                  <div>
                    <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 block mb-1">Media URL (Video/Image)</label>
                    <input 
                      type="text" 
                      value={selectedToken.mediaUrl || ''}
                      onChange={e => updateToken(selectedToken.id, { mediaUrl: e.target.value })}
                      className="w-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded p-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-white"
                      placeholder="https://..."
                    />
                    {selectedToken.mediaUrl && (
                      <a href={selectedToken.mediaUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline mt-1 block">
                        Open Media
                      </a>
                    )}
                  </div>
                )}
                
                <div>
                  <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1 block">Scale</label>
                  <div className="flex gap-2 items-center">
                    <input 
                      type="range" 
                      min="0.5" max="3" step="0.1" 
                      value={selectedToken.scale || 1}
                      onChange={e => updateToken(selectedToken.id, { scale: parseFloat(e.target.value) })}
                      className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <span className="text-xs font-mono w-8 text-right text-black dark:text-white">{selectedToken.scale || 1}x</span>
                  </div>
                </div>

                {(selectedToken.type === 'attacker' || selectedToken.type === 'defender') && (
                  <>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 block">Vision Cone</label>
                        <button 
                          onClick={() => updateToken(selectedToken.id, { showCone: selectedToken.showCone === false ? true : false })}
                          className={`text-[10px] px-1.5 py-0.5 rounded ${selectedToken.showCone !== false ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300'}`}
                        >
                          {selectedToken.showCone !== false ? 'Hide Cone' : 'Show Cone'}
                        </button>
                      </div>
                      
                      <div className="flex gap-2 items-center mb-2">
                        <label className="text-[10px] text-neutral-400 w-12">FOV</label>
                        <input 
                          type="range" 
                          min="10" max="180" step="1" 
                          value={selectedToken.fov || 57}
                          onChange={e => updateToken(selectedToken.id, { fov: parseInt(e.target.value) })}
                          className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                        <span className="text-[10px] font-mono w-8 text-right text-black dark:text-white">{selectedToken.fov || 57}°</span>
                      </div>
                      
                      <div className="flex gap-2 items-center mb-2">
                        <label className="text-[10px] text-neutral-400 w-12">Length</label>
                        <input 
                          type="range" 
                          min="50" max="500" step="10" 
                          value={selectedToken.visionLength || 425}
                          onChange={e => updateToken(selectedToken.id, { visionLength: parseInt(e.target.value) })}
                          className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                        <span className="text-[10px] font-mono w-8 text-right text-black dark:text-white">{selectedToken.visionLength || 425}px</span>
                      </div>

                      <div className="flex gap-2 items-center">
                        <label className="text-[10px] text-neutral-400 w-12">Opacity</label>
                        <input 
                          type="range" 
                          min="0.05" max="0.8" step="0.05" 
                          value={selectedToken.visionOpacity || 0.15}
                          onChange={e => updateToken(selectedToken.id, { visionOpacity: parseFloat(e.target.value) })}
                          className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                        <span className="text-[10px] font-mono w-8 text-right text-black dark:text-white">{Math.round((selectedToken.visionOpacity || 0.15) * 100)}%</span>
                      </div>
                    </div>
                  </>
                )}
                <div>
                  <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 block mb-1">Color</label>
                  <ColorPicker value={selectedToken.color || '#FFFFFF'} onChange={setColor} />
                </div>
              </>
            )}
            {selectedLine && (
              <div className="space-y-3">
                {selectedLine.tool === 'text' && (
                  <div>
                    <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 block mb-1">Text Content</label>
                    <input 
                      type="text" 
                      value={selectedLine.text || ''}
                      onChange={e => updateLine(selectedLine.id, { text: e.target.value })}
                      className="w-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded p-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-white"
                      placeholder="Type here..."
                    />
                  </div>
                )}
                <div className="text-xs text-neutral-500 dark:text-neutral-400 italic mb-2">Drawing selected. You can delete it using the trash icon.</div>
                <div>
                  <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 block mb-1">Color</label>
                  <ColorPicker value={selectedLine.color || '#FFFFFF'} onChange={setColor} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
