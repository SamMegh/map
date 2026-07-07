/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { TopBar, BottomBar } from './components/Bars';
import { Modal } from './components/Modal';
import { SidebarLeft } from './components/SidebarLeft';
import { FloatingControlBar } from './components/FloatingControlBar';
import { SidebarRight } from './components/SidebarRight';
import { TacMap } from './components/TacMap';
import { ToolType, TokenData, LineData, MapObjectives } from './types';
import { getPointAlongPath } from './utils';

import { defaultMaps, gamesData, MapData } from './data/maps';

const getInitialTokens = (mapId?: string, gameMode?: string): TokenData[] => {
  const map = defaultMaps.find(m => m.id === mapId);
  const w = 1920;
  const h = 1080;
  
  const t1Spawn = map?.spawns?.team1 || { x: 1050 / 1920, y: 150 / 1080, rotation: 90 };
  const t2Spawn = map?.spawns?.team2 || { x: 1400 / 1920, y: 950 / 1080, rotation: 270 };

  const t1Rot = t1Spawn.rotation !== undefined ? t1Spawn.rotation : 90;
  const t2Rot = t2Spawn.rotation !== undefined ? t2Spawn.rotation : 270;

  return [
    { id: 'a1', type: 'attacker', x: (t1Spawn.x * w) - 50, y: (t1Spawn.y * h), rotation: t1Rot, label: '1', color: '#ff1100' },
    { id: 'a2', type: 'attacker', x: (t1Spawn.x * w), y: (t1Spawn.y * h) - 50, rotation: t1Rot, label: '2', color: '#ff1100' },
    { id: 'a3', type: 'attacker', x: (t1Spawn.x * w), y: (t1Spawn.y * h) + 50, rotation: t1Rot, label: '3', color: '#ff1100' },
    { id: 'a4', type: 'attacker', x: (t1Spawn.x * w) + 50, y: (t1Spawn.y * h), rotation: t1Rot, label: '4', color: '#ff1100' },
    { id: 'a5', type: 'attacker', x: (t1Spawn.x * w), y: (t1Spawn.y * h), rotation: t1Rot, label: '5', color: '#ff1100' },

    { id: 'd1', type: 'defender', x: (t2Spawn.x * w) - 50, y: (t2Spawn.y * h), rotation: t2Rot, label: '1', color: '#0055ff' },
    { id: 'd2', type: 'defender', x: (t2Spawn.x * w), y: (t2Spawn.y * h) - 50, rotation: t2Rot, label: '2', color: '#0055ff' },
    { id: 'd3', type: 'defender', x: (t2Spawn.x * w), y: (t2Spawn.y * h) + 50, rotation: t2Rot, label: '3', color: '#0055ff' },
    { id: 'd4', type: 'defender', x: (t2Spawn.x * w) + 50, y: (t2Spawn.y * h), rotation: t2Rot, label: '4', color: '#0055ff' },
    { id: 'd5', type: 'defender', x: (t2Spawn.x * w), y: (t2Spawn.y * h), rotation: t2Rot, label: '5', color: '#0055ff' }
  ];
};

export default function App() {
  const [activeTool, setActiveTool] = useState<ToolType>('select');
  const [color, setColor] = useState<string>('#FFFFFF');
  const [showAttackers, setShowAttackers] = useState(true);
  const [showDefenders, setShowDefenders] = useState(true);
  const [showObjectives, setShowObjectives] = useState(true);

  // Default tokens init safely for browser
  const [frames, setFrames] = useState<TokenData[][]>([[]]);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [lines, setLines] = useState<LineData[]>([]);
  const [gameMode, setGameMode] = useState<string>('SND');
  
  const [animatingTokens, setAnimatingTokens] = useState<TokenData[] | null>(null);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState<number>(1);
  const [showMapObjectives, setShowMapObjectives] = useState(true);
  const [showLines, setShowLines] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [gridSize, setGridSize] = useState(20);
  
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  const [showTopBar, setShowTopBar] = useState(true);
  const [showBottomBar, setShowBottomBar] = useState(true);
  const [showSidebarLeft, setShowSidebarLeft] = useState(true);
  const [showSidebarRight, setShowSidebarRight] = useState(true);

  const [customMaps, setCustomMaps] = useState<MapData[]>([]);
  const [activeGameId, setActiveGameId] = useState<string>(gamesData[0].id);
  const [activeMapId, setActiveMapId] = useState<string>(defaultMaps[0].id);

  const filteredMaps = activeGameId === 'custom' ? customMaps : defaultMaps.filter(m => m.gameId === activeGameId);

  const [mapObjectives, setMapObjectives] = useState<MapObjectives>(defaultMaps[0].objectives as MapObjectives);

  const [history, setHistory] = useState<{ frames: TokenData[][], lines: LineData[], mapObjectives: MapObjectives }[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [needsHistoryPush, setNeedsHistoryPush] = useState(false);
  const [autoSaveFrequency, setAutoSaveFrequency] = useState<'frequent' | 'significant' | 'off'>('frequent');

  const stageRef = useRef<any>(null);

  const takeSnapshot = () => {
    if (stageRef.current) {
      const uri = stageRef.current.toDataURL({ pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `snapshot_${activeMapId}_frame_${currentFrameIndex + 1}.png`;
      link.href = uri;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Initialize once window is available
  useEffect(() => {
    try {
      const dataStr = localStorage.getItem('tactical_board_state_autosave');
      if (dataStr) {
        const data = JSON.parse(dataStr);
        setFrames(data.frames && data.frames.length > 0 ? data.frames : [getInitialTokens(data.activeMapId, data.gameMode)]);
        setLines(data.lines || []);
        if (data.mapObjectives) setMapObjectives(data.mapObjectives);
        if (data.activeMapId) setActiveMapId(data.activeMapId);
        if (data.gameMode) setGameMode(data.gameMode);
        if (data.autoSaveFrequency) setAutoSaveFrequency(data.autoSaveFrequency);
        if (data.customMaps) setCustomMaps(data.customMaps);
        if (data.activeGameId) setActiveGameId(data.activeGameId);
        else {
          const map = defaultMaps.find(m => m.id === data.activeMapId);
          if (map) setActiveGameId(map.gameId);
        }
        return;
      }
    } catch (e) {
      console.error('Error loading autosave:', e);
    }
    setFrames([getInitialTokens(activeMapId, gameMode)]);
  }, []);

  useEffect(() => {
    if (frames.length > 0 && frames[0].length > 0 && history.length === 0) {
      setHistory([{ frames, lines, mapObjectives }]);
      setHistoryIndex(0);
    }
  }, [frames, lines, mapObjectives, history]);

  useEffect(() => {
    if (needsHistoryPush) {
      setHistory(prev => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push(JSON.parse(JSON.stringify({ frames, lines, mapObjectives })));
        return newHistory;
      });
      setHistoryIndex(prev => prev + 1);
      setNeedsHistoryPush(false);
    }
  }, [needsHistoryPush, frames, lines, mapObjectives, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setFrames(prev.frames);
      setLines(prev.lines);
      setMapObjectives(prev.mapObjectives);
      setHistoryIndex(historyIndex - 1);
      if (currentFrameIndex >= prev.frames.length) {
        setCurrentFrameIndex(prev.frames.length - 1);
      }
    }
  }, [history, historyIndex, currentFrameIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setFrames(next.frames);
      setLines(next.lines);
      setMapObjectives(next.mapObjectives);
      setHistoryIndex(historyIndex + 1);
      if (currentFrameIndex >= next.frames.length) {
        setCurrentFrameIndex(next.frames.length - 1);
      }
    }
  }, [history, historyIndex, currentFrameIndex]);



  const exportStrategy = () => {
    try {
      const data = { frames, lines, mapObjectives, activeMapId, gameMode, customMaps, activeGameId };
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
      const link = document.createElement('a');
      link.href = dataStr;
      link.download = `strategy_${activeMapId}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error('Error exporting strategy:', e);
      alert('Failed to export strategy.');
    }
  };

  
  

  
  const exportGif = async () => {
    if (!stageRef.current) return;
    try {
      const { GIFEncoder, quantize, applyPalette } = await import('gifenc');
      
      const width = stageRef.current.width();
      const height = stageRef.current.height();
      
      const exportScale = 0.5; // downscale to 50% for performance and file size
      const exportWidth = Math.round(width * exportScale);
      const exportHeight = Math.round(height * exportScale);
      
      const offscreenCanvas = document.createElement('canvas');
      offscreenCanvas.width = exportWidth;
      offscreenCanvas.height = exportHeight;
      const offscreenCtx = offscreenCanvas.getContext('2d');
      if (!offscreenCtx) return;
      
      const gif = GIFEncoder();
      
      const fps = 10;
      const delay = 1000 / fps;
      const framesToGenerate = Math.round(fps / animationSpeed);
      
      setIsPlaying(false);
      setIsLooping(false);
      
      const originalIndex = currentFrameIndex;
      
      if (frames.length <= 1) {
          const uri = stageRef.current.toDataURL({ pixelRatio: exportScale });
          const img = new Image();
          img.src = uri;
          await new Promise(resolve => img.onload = resolve);
          offscreenCtx.drawImage(img, 0, 0);
          const imageData = offscreenCtx.getImageData(0, 0, exportWidth, exportHeight);
          const palette = quantize(imageData.data, 256, { format: 'rgba4444' });
          const index = applyPalette(imageData.data, palette, 'rgba4444');
          gif.writeFrame(index, exportWidth, exportHeight, { palette, delay: 1000 });
      } else {
        for (let i = 0; i < frames.length - 1; i++) {
          const startTokens = frames[i];
          const endTokens = frames[i+1];
          
          for (let frame = 0; frame < framesToGenerate; frame++) {
            let progress = frame / framesToGenerate;
            const easeProgress = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
            
            const interpolated = startTokens.map(st => {
              const et = endTokens.find(t => t.id === st.id) || st;
              const sRot = st.rotation || 0;
              const eRot = et.rotation || 0;
              let rotDiff = eRot - sRot;
              while (rotDiff > 180) rotDiff -= 360;
              while (rotDiff < -180) rotDiff += 360;
              
              
              const attachedLine = lines.find(l => {
                if (l.attachedTokenId !== st.id) return false;
                if (l.tool !== 'pen' && l.tool !== 'polygon' && l.tool !== 'arrow') return false;
                const lineStart = { x: l.points[0], y: l.points[1] };
                const dist = Math.hypot(lineStart.x - st.x, lineStart.y - st.y);
                return dist < 100;
              });
              
              if (attachedLine) {
                 const pos = getPointAlongPath(attachedLine.points, easeProgress);
                 return {
                    ...st,
                    x: pos.x,
                    y: pos.y,
                    rotation: sRot + rotDiff * Math.min(easeProgress * 1.5, 1),
                 };
              } else {
                 return {
                    ...st,
                    x: st.x + (et.x - st.x) * easeProgress,
                    y: st.y + (et.y - st.y) * easeProgress,
                    rotation: sRot + rotDiff * easeProgress,
                 };
              }
            });
            
            setAnimatingTokens(interpolated);
            
            // Wait for React to render
            await new Promise(resolve => setTimeout(resolve, 50));
            
            const uri = stageRef.current.toDataURL({ pixelRatio: exportScale });
            const img = new Image();
            img.src = uri;
            await new Promise(resolve => img.onload = resolve);
            offscreenCtx.clearRect(0, 0, exportWidth, exportHeight);
            offscreenCtx.drawImage(img, 0, 0);
            
            const imageData = offscreenCtx.getImageData(0, 0, exportWidth, exportHeight);
            const palette = quantize(imageData.data, 256, { format: 'rgba4444' });
            const index = applyPalette(imageData.data, palette, 'rgba4444');
            gif.writeFrame(index, exportWidth, exportHeight, { palette, delay });
          }
        }
      }
      
      gif.finish();
      const output = gif.bytes();
      const blob = new Blob([output], { type: 'image/gif' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `animation_${activeMapId}.gif`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setAnimatingTokens(null);
      setCurrentFrameIndex(originalIndex);
    } catch (e) {
      console.error('Error exporting GIF:', e);
      alert('Failed to export GIF.');
      setAnimatingTokens(null);
    }
  };

  
  const exportVideo = async () => {
    if (!stageRef.current) return;
    try {
      if (typeof VideoEncoder === 'undefined') {
          alert('VideoEncoder API is not supported in this browser. Please use Chrome or Edge.');
          return;
      }
      
      const { Muxer, ArrayBufferTarget } = await import('mp4-muxer');
      
      const width = stageRef.current.width();
      const height = stageRef.current.height();
      
      // MP4 requires dimensions to be even numbers
      const exportWidth = width % 2 === 0 ? width : width - 1;
      const exportHeight = height % 2 === 0 ? height : height - 1;
      
      const offscreenCanvas = document.createElement('canvas');
      offscreenCanvas.width = exportWidth;
      offscreenCanvas.height = exportHeight;
      const offscreenCtx = offscreenCanvas.getContext('2d', { willReadFrequently: true });
      if (!offscreenCtx) return;
      
      const muxer = new Muxer({
        target: new ArrayBufferTarget(),
        video: {
            codec: 'avc',
            width: exportWidth,
            height: exportHeight
        },
        firstTimestampBehavior: 'offset',
        fastStart: 'in-memory'
      });

      const videoEncoder = new VideoEncoder({
        output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
        error: e => console.error(e)
      });
      
      videoEncoder.configure({
        codec: 'avc1.420028',
        width: exportWidth,
        height: exportHeight,
        bitrate: 2_500_000,
        framerate: 30
      });
      
      const fps = 30;
      const framesToGenerate = Math.round(fps / animationSpeed);
      let frameCount = 0;
      
      setIsPlaying(false);
      setIsLooping(false);
      
      const originalIndex = currentFrameIndex;
      
      const captureAndEncodeFrame = async () => {
          // Wait for React to render the animating tokens
          await new Promise(resolve => setTimeout(resolve, 50));
          
          const uri = stageRef.current.toDataURL({ pixelRatio: 1 });
          const img = new Image();
          img.src = uri;
          await new Promise(resolve => img.onload = resolve);
          
          offscreenCtx.fillStyle = '#111111';
          offscreenCtx.fillRect(0, 0, exportWidth, exportHeight);
          offscreenCtx.drawImage(img, 0, 0, exportWidth, exportHeight);
          
          const timestamp = (frameCount * 1000000) / fps;
          const frame = new VideoFrame(offscreenCanvas, { timestamp });
          videoEncoder.encode(frame);
          frame.close();
          frameCount++;
      };
      
      if (frames.length <= 1) {
          const uri = stageRef.current.toDataURL({ pixelRatio: 1 });
          const img = new Image();
          img.src = uri;
          await new Promise(resolve => img.onload = resolve);
          
          offscreenCtx.fillStyle = '#111111';
          offscreenCtx.fillRect(0, 0, exportWidth, exportHeight);
          offscreenCtx.drawImage(img, 0, 0, exportWidth, exportHeight);
          
          // Record 1 second for single frame
          for (let i = 0; i < framesToGenerate; i++) {
             const timestamp = (frameCount * 1000000) / fps;
             const frame = new VideoFrame(offscreenCanvas, { timestamp });
             videoEncoder.encode(frame);
             frame.close();
             frameCount++;
          }
      } else {
        for (let i = 0; i < frames.length - 1; i++) {
          const startTokens = frames[i];
          const endTokens = frames[i+1];
          
          for (let frame = 0; frame < framesToGenerate; frame++) {
            let progress = frame / framesToGenerate;
            const easeProgress = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
            
            const interpolated = startTokens.map(st => {
              const et = endTokens.find(t => t.id === st.id) || st;
              const sRot = st.rotation || 0;
              const eRot = et.rotation || 0;
              let rotDiff = eRot - sRot;
              while (rotDiff > 180) rotDiff -= 360;
              while (rotDiff < -180) rotDiff += 360;
              
              
              const attachedLine = lines.find(l => {
                if (l.attachedTokenId !== st.id) return false;
                if (l.tool !== 'pen' && l.tool !== 'polygon' && l.tool !== 'arrow') return false;
                const lineStart = { x: l.points[0], y: l.points[1] };
                const dist = Math.hypot(lineStart.x - st.x, lineStart.y - st.y);
                return dist < 100;
              });
              
              if (attachedLine) {
                 const pos = getPointAlongPath(attachedLine.points, easeProgress);
                 return {
                    ...st,
                    x: pos.x,
                    y: pos.y,
                    rotation: sRot + rotDiff * Math.min(easeProgress * 1.5, 1),
                 };
              } else {
                 return {
                    ...st,
                    x: st.x + (et.x - st.x) * easeProgress,
                    y: st.y + (et.y - st.y) * easeProgress,
                    rotation: sRot + rotDiff * easeProgress,
                 };
              }
            });
            
            setAnimatingTokens(interpolated);
            await captureAndEncodeFrame();
          }
        }
      }
      
      await videoEncoder.flush();
      muxer.finalize();
      
      const buffer = muxer.target.buffer;
      const blob = new Blob([buffer], { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `animation_${activeMapId}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setAnimatingTokens(null);
      setCurrentFrameIndex(originalIndex);
    } catch (e) {
      console.error('Error exporting video:', e);
      alert('Failed to export video.');
      setAnimatingTokens(null);
    }
  };



  const importStrategy = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          setFrames(data.frames || [getInitialTokens(data.activeMapId, data.gameMode)]);
          setLines(data.lines || []);
          setMapObjectives(data.mapObjectives || defaultMaps[0].objectives);
          setActiveMapId(data.activeMapId || defaultMaps[0].id);
          setGameMode(data.gameMode || 'SND');
          if (data.customMaps) setCustomMaps(data.customMaps);
          if (data.activeGameId) setActiveGameId(data.activeGameId);
          setHistory([]);
          setHistoryIndex(-1);
          setCurrentFrameIndex(0);
          alert('Strategy imported successfully!');
        } catch (e) {
          console.error('Error importing strategy:', e);
          alert('Failed to import strategy. Invalid file format.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const currentTokens = animatingTokens || frames[currentFrameIndex] || [];

  const performAutosave = () => {
    try {
      if (frames.length === 0 || frames[0].length === 0) return;
      const data = { frames, lines, mapObjectives, activeMapId, gameMode, autoSaveFrequency, customMaps, activeGameId };
      localStorage.setItem('tactical_board_state_autosave', JSON.stringify(data));
    } catch (e: any) {
      if (e.name === 'QuotaExceededError') {
        console.error('Local storage quota exceeded. Custom maps may be too large.');
      } else {
        console.error('Error autosaving:', e);
      }
    }
  };

  useEffect(() => {
    if (autoSaveFrequency === 'frequent') {
      performAutosave();
    }
  }, [frames, lines, mapObjectives, activeMapId, gameMode, autoSaveFrequency, customMaps, activeGameId]);

  useEffect(() => {
    if (autoSaveFrequency === 'significant') {
      performAutosave();
    }
  }, [historyIndex, autoSaveFrequency]);

  const saveStrategy = useCallback(() => {
    try {
      const data = {
        frames,
        lines,
        mapObjectives,
        activeMapId,
        gameMode,
        activeGameId,
        customMaps
      };
      localStorage.setItem('tactical_board_state', JSON.stringify(data));
      alert('Strategy saved successfully!');
    } catch (e: any) {
      if (e.name === 'QuotaExceededError') {
        alert('Failed to save strategy. Local storage quota exceeded (Custom maps might be too large).');
      } else {
        console.error('Error saving strategy:', e);
        alert('Failed to save strategy. LocalStorage might be disabled.');
      }
    }
  }, [frames, lines, mapObjectives, activeMapId, gameMode, activeGameId, customMaps]);

  const loadStrategy = () => {
    try {
      const dataStr = localStorage.getItem('tactical_board_state');
      if (dataStr) {
        const data = JSON.parse(dataStr);
        setFrames(data.frames || [getInitialTokens(data.activeMapId, data.gameMode)]);
        setLines(data.lines || []);
        setMapObjectives(data.mapObjectives || defaultMaps[0].objectives);
        setActiveMapId(data.activeMapId || defaultMaps[0].id);
        setGameMode(data.gameMode || 'SND');
        if (data.customMaps) setCustomMaps(data.customMaps);
        if (data.activeGameId) setActiveGameId(data.activeGameId);
        setHistory([]);
        setHistoryIndex(-1);
        setCurrentFrameIndex(0);
        alert('Strategy loaded successfully!');
      } else {
        alert('No saved strategy found.');
      }
    } catch (e) {
      console.error('Error loading strategy:', e);
      alert('Failed to load strategy.');
    }
  };

  const resetStrategy = () => {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      localStorage.removeItem('tactical_board_state_autosave');
      const activeMap = filteredMaps.find(m => m.id === activeMapId) || filteredMaps[0] || defaultMaps[0];
      setFrames([getInitialTokens(activeMap.id, 'SND')]);
      setLines([]);
      setMapObjectives(activeMap.objectives as MapObjectives);
      setCurrentFrameIndex(0);
      setHistory([]);
      setHistoryIndex(-1);
    }
  };

  const setTokens = (newTokens: TokenData[] | ((prev: TokenData[]) => TokenData[])) => {
    setFrames(prevFrames => {
      const newFrames = [...prevFrames];
      const prev = newFrames[currentFrameIndex] || [];
      newFrames[currentFrameIndex] = typeof newTokens === 'function' ? newTokens(prev) : newTokens;
      return newFrames;
    });
  };

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    if (selectedItemIds.length > 0) {
      let tokensUpdated = false;
      const updatedTokens = currentTokens.map(t => {
        if (selectedItemIds.includes(t.id)) { tokensUpdated = true; return { ...t, color: newColor }; }
        return t;
      });
      if (tokensUpdated) { setTokens(updatedTokens); setNeedsHistoryPush(true); }

      let linesUpdated = false;
      const updatedLines = lines.map(l => {
        if (selectedItemIds.includes(l.id)) { linesUpdated = true; return { ...l, color: newColor }; }
        return l;
      });
      if (linesUpdated) { setLines(updatedLines); setNeedsHistoryPush(true); }
    }
  };

  const updateToken = (id: string, updates: Partial<TokenData>) => {
    const updated = currentTokens.map(t => t.id === id ? { ...t, ...updates } : t);
    setTokens(updated);
    setNeedsHistoryPush(true);
  };

  const updateLine = (id: string, updates: Partial<LineData>) => {
    const updated = lines.map(l => l.id === id ? { ...l, ...updates } : l);
    setLines(updated);
    setNeedsHistoryPush(true);
  };

  const deleteItem = (idOrIds: string | string[]) => {
    const ids = Array.isArray(idOrIds) ? idOrIds : [idOrIds];
    const updatedTokens = currentTokens.filter(t => !ids.includes(t.id));
    if (updatedTokens.length !== currentTokens.length) {
      setTokens(updatedTokens);
      setNeedsHistoryPush(true);
    }
    const updatedLines = lines.filter(l => !ids.includes(l.id));
    if (updatedLines.length !== lines.length) {
      setLines(updatedLines);
      setNeedsHistoryPush(true);
    }
    setSelectedItemIds(prev => prev.filter(i => !ids.includes(i)));
  };

  const addFrame = useCallback(() => {
    const currentTokens = frames[currentFrameIndex] || [];
    const newFrame = JSON.parse(JSON.stringify(currentTokens)) as TokenData[];
    
    newFrame.forEach(token => {
      const attachedLine = lines.find(l => {
        if (l.attachedTokenId !== token.id) return false;
        if (l.tool !== 'pen' && l.tool !== 'polygon' && l.tool !== 'arrow') return false;
        const lineStart = { x: l.points[0], y: l.points[1] };
        const dist = Math.hypot(lineStart.x - token.x, lineStart.y - token.y);
        return dist < 100;
      });
      if (attachedLine) {
        const endPoint = getPointAlongPath(attachedLine.points, 1);
        token.x = endPoint.x;
        token.y = endPoint.y;
      }
    });

    setFrames([...frames, newFrame]);
    setCurrentFrameIndex(frames.length);
    setNeedsHistoryPush(true);
  }, [frames, currentFrameIndex, lines]);

  const deleteFrame = () => {
    if (frames.length <= 1) return;
    const newFrames = [...frames];
    newFrames.splice(currentFrameIndex, 1);
    setFrames(newFrames);
    setCurrentFrameIndex(Math.min(currentFrameIndex, newFrames.length - 1));
    setNeedsHistoryPush(true);
  };

  useEffect(() => {
    if (isPlaying) {
      if (frames.length <= 1) {
        setIsPlaying(false);
        return;
      }
      
      if (currentFrameIndex === frames.length - 1) {
        if (!isLooping) {
          setIsPlaying(false);
          return;
        } else {
          const timer = setTimeout(() => {
            setCurrentFrameIndex(0);
          }, 500);
          return () => clearTimeout(timer);
        }
      }
      
      const DURATION = 1000 / animationSpeed;
      let start = performance.now();
      let nextFrameIndex = (currentFrameIndex + 1) % frames.length;
      let frameReq: number;

      const animate = (time: number) => {
        let progress = (time - start) / DURATION;
        if (progress > 1) progress = 1;

        const easeProgress = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;

        const startTokens = frames[currentFrameIndex];
        const endTokens = frames[nextFrameIndex];

        const interpolated = startTokens.map(st => {
          const et = endTokens.find(t => t.id === st.id) || st;
          const sRot = st.rotation || 0;
          const eRot = et.rotation || 0;
          let rotDiff = eRot - sRot;
          while (rotDiff > 180) rotDiff -= 360;
          while (rotDiff < -180) rotDiff += 360;

          const attachedLine = lines.find(l => {
            if (l.attachedTokenId !== st.id) return false;
            if (l.tool !== 'pen' && l.tool !== 'polygon' && l.tool !== 'arrow') return false;
            const lineStart = { x: l.points[0], y: l.points[1] };
            const dist = Math.hypot(lineStart.x - st.x, lineStart.y - st.y);
            return dist < 100;
          });
          
          let pos = { x: st.x + (et.x - st.x) * easeProgress, y: st.y + (et.y - st.y) * easeProgress };

          if (attachedLine) {
            pos = getPointAlongPath(attachedLine.points, easeProgress);
          }

          return {
            ...st,
            x: pos.x,
            y: pos.y,
            rotation: sRot + rotDiff * easeProgress,
          };
        });

        setAnimatingTokens(interpolated);

        if (progress === 1) {
          setCurrentFrameIndex(nextFrameIndex);
          setAnimatingTokens(null);
        } else {
          frameReq = requestAnimationFrame(animate);
        }
      };

      frameReq = requestAnimationFrame(animate);
      return () => {
        cancelAnimationFrame(frameReq);
        setAnimatingTokens(null);
      };
    } else {
      setAnimatingTokens(null);
    }
  }, [isPlaying, currentFrameIndex, frames, isLooping, lines, animationSpeed]);

  const togglePlay = useCallback(() => {
    if (!isPlaying && currentFrameIndex === frames.length - 1) {
      setCurrentFrameIndex(0);
    }
    setIsPlaying(p => !p);
  }, [isPlaying, currentFrameIndex, frames.length]);

  const selectedToken = selectedItemIds.length === 1 ? currentTokens.find(t => t.id === selectedItemIds[0]) : undefined;
  const selectedLine = selectedItemIds.length === 1 ? lines.find(l => l.id === selectedItemIds[0]) : undefined;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
        e.preventDefault();
        return;
      }
      
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        saveStrategy();
        return;
      }

      switch (e.key.toLowerCase()) {
        case 's': setActiveTool('select'); break;
        case 'p': setActiveTool('pen'); break;
        case 'a': setActiveTool('arrow'); break;
        case 't': setActiveTool('text'); break;
        case 'e': setActiveTool('eraser'); break;
        case 'r': setActiveTool('ruler'); break;
        case 'n': addFrame(); break;
        case ' ': 
          e.preventDefault();
          setIsPlaying(p => !p);
          break;
        case 'h': 
          setShowAttackers(prev => !prev);
          setShowDefenders(prev => !prev);
          break;
        case 'j': 
          setShowLines(prev => !prev);
          break;
        case '1': setSelectedItemIds(['']); setActiveTool('select'); break;
        case '2': setSelectedItemIds(['']); setActiveTool('select'); break;
        case '3': setSelectedItemIds(['']); setActiveTool('select'); break;
        case '4': setSelectedItemIds(['']); setActiveTool('select'); break;
        case '5': setSelectedItemIds(['']); setActiveTool('select'); break;
        case '6': setSelectedItemIds(['']); setActiveTool('select'); break;
        case '7': setSelectedItemIds(['']); setActiveTool('select'); break;
        case '8': setSelectedItemIds(['']); setActiveTool('select'); break;
        case '9': setSelectedItemIds(['']); setActiveTool('select'); break;
        case '0': setSelectedItemIds(['']); setActiveTool('select'); break;
        case 'arrowleft': 
          setCurrentFrameIndex(prev => Math.max(0, prev - 1));
          break;
        case 'arrowright': 
          setCurrentFrameIndex(prev => Math.min(frames.length - 1, prev + 1));
          break;
        case '=':
        case '+':
          window.dispatchEvent(new CustomEvent('zoom-in'));
          break;
        case '-':
        case '_':
          window.dispatchEvent(new CustomEvent('zoom-out'));
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [history, historyIndex, undo, redo, frames, saveStrategy, currentFrameIndex, lines, addFrame]);

  const activeMap = filteredMaps.find(m => m.id === activeMapId) || filteredMaps[0] || defaultMaps[0];

  return (
    <div className="w-screen h-screen overflow-hidden bg-[#ffffff] font-sans selection:bg-blue-500/30">
      
      <FloatingControlBar
        showTop={showTopBar}
        setShowTop={setShowTopBar}
        showBottom={showBottomBar}
        setShowBottom={setShowBottomBar}
        showLeft={showSidebarLeft}
        setShowLeft={setShowSidebarLeft}
        showRight={showSidebarRight}
        setShowRight={setShowSidebarRight}
      />
      {showTopBar && <TopBar 
        frames={frames}
        currentFrameIndex={currentFrameIndex}
        setCurrentFrameIndex={setCurrentFrameIndex}
        addFrame={addFrame}
        isPlaying={isPlaying}
        togglePlay={togglePlay}
        isLooping={isLooping}
        setIsLooping={setIsLooping}
        undo={undo}
        redo={redo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        showGrid={showGrid}
        setShowGrid={setShowGrid}
        games={gamesData}
        activeGameId={activeGameId}
        onGameChange={(id) => {
           setActiveGameId(id);
           const gameMaps = defaultMaps.filter(m => m.gameId === id);
           if (gameMaps.length > 0) {
             const firstMap = gameMaps[0];
             const newSupportedModes = firstMap.supportedModes || ['SND', 'HP', 'DOM', 'CTL', 'TDM', 'LINEUPS'];
             let newGameMode = gameMode;
             if (!newSupportedModes.includes(gameMode)) {
               newGameMode = newSupportedModes[0] as any;
               setGameMode(newGameMode);
             }
             setActiveMapId(firstMap.id);
             setMapObjectives(firstMap.objectives as MapObjectives);
             setHistory([]);
             setHistoryIndex(-1);
             setFrames([getInitialTokens(firstMap.id, newGameMode)]);
             setLines([]);
           }
        }}
        maps={filteredMaps}
        activeMapId={activeMapId}
        onCustomMapUpload={(name, imageData) => {
           const newCustomMap: MapData = {
              id: `custom_${Date.now()}`,
              gameId: 'custom',
              name: name || 'Custom Map',
              image: imageData,
              supportedModes: ['SND', 'HP', 'DOM', 'CTL', 'TDM', 'BR', 'Resurgence', 'LINEUPS'],
              objectives: {}
           };
           setCustomMaps(prev => [...prev, newCustomMap]);
           setActiveMapId(newCustomMap.id);
           setMapObjectives({});
           setHistory([]);
           setHistoryIndex(-1);
           setFrames([getInitialTokens(newCustomMap.id, gameMode)]);
           setLines([]);
        }}
        onMapChange={(id) => {
           const map = filteredMaps.find(m => m.id === id) || defaultMaps.find(m => m.id === id);
           if (map) {
             const newSupportedModes = map.supportedModes || ['SND', 'HP', 'DOM', 'CTL', 'TDM', 'LINEUPS'];
             let newGameMode = gameMode;
             if (!newSupportedModes.includes(gameMode)) {
               newGameMode = newSupportedModes[0] as any;
               setGameMode(newGameMode);
             }
             setActiveMapId(id);
             setMapObjectives(map.objectives as MapObjectives);
             // Clear history when map changes
             setHistory([]);
             setHistoryIndex(-1);
             setFrames([getInitialTokens(id, newGameMode)]);
             setLines([]);
           }
        }}
        onSave={saveStrategy}
        onLoad={loadStrategy}
        onReset={resetStrategy}
        onSnapshot={takeSnapshot}
        onExport={exportStrategy}
        onImport={importStrategy}
        onExportFramesZip={exportVideo}
        onExportGif={exportGif}
        onDeleteFrame={deleteFrame}
        autoSaveFrequency={autoSaveFrequency}
        setAutoSaveFrequency={setAutoSaveFrequency}
        animationSpeed={animationSpeed}
        setAnimationSpeed={setAnimationSpeed}
      />}
      {showSidebarLeft && <SidebarLeft 
        color={color}
        setColor={handleColorChange}
        activeTool={activeTool} 
        setActiveTool={setActiveTool}
        selectedToken={selectedToken}
        selectedLine={selectedLine}
        selectedItemIds={selectedItemIds}
        updateToken={updateToken}
        updateLine={updateLine}
        deleteItem={deleteItem}
        isLocked={isLocked}
        setIsLocked={setIsLocked}
      />}
      {showSidebarRight && <SidebarRight 
        color={color} 
        setColor={handleColorChange}
        showAttackers={showAttackers}
        setShowAttackers={setShowAttackers}
        showDefenders={showDefenders}
        setShowDefenders={setShowDefenders}
        showObjectives={showObjectives}
        setShowObjectives={setShowObjectives}
        showMapObjectives={showMapObjectives}
        setShowMapObjectives={setShowMapObjectives}
        showLines={showLines}
        setShowLines={setShowLines}
        gameMode={gameMode}
      />}
      
      {/* Interactive Map Area */}
      <div className="absolute inset-0">
        <TacMap 
          tool={activeTool} 
          color={color}
          showAttackers={showAttackers}
          showDefenders={showDefenders}
          showObjectives={showObjectives}
          showMapObjectives={showMapObjectives}
          showLines={showLines}
          tokens={animatingTokens || currentTokens}
          setTokens={setTokens}
          lines={lines}
          setLines={setLines}
          selectedItemIds={selectedItemIds}
          setSelectedItemIds={setSelectedItemIds}
          isLocked={isLocked}
          gameMode={gameMode}
          mapObjectives={mapObjectives}
          setMapObjectives={setMapObjectives}
          mapImageUrl={activeMap.image}
          onHistoryPush={() => setNeedsHistoryPush(true)}
          stageRef={stageRef}
        />
      </div>

      {showBottomBar && <BottomBar gameMode={gameMode} setGameMode={setGameMode} maps={filteredMaps} activeMapId={activeMapId} onShowShortcuts={() => setShowShortcutsModal(true)} onShowSettings={() => setShowSettingsModal(true)}
      />}
      <Modal isOpen={showShortcutsModal} onClose={() => setShowShortcutsModal(false)} title="Keyboard Shortcuts">
        <ul className="space-y-2">
          <li><kbd className="bg-neutral-800 px-2 py-1 rounded text-xs">s</kbd> Select</li>
          <li><kbd className="bg-neutral-800 px-2 py-1 rounded text-xs">p</kbd> Pen</li>
          <li><kbd className="bg-neutral-800 px-2 py-1 rounded text-xs">a</kbd> Arrow</li>
          <li><kbd className="bg-neutral-800 px-2 py-1 rounded text-xs">t</kbd> Text</li>
          <li><kbd className="bg-neutral-800 px-2 py-1 rounded text-xs">e</kbd> Eraser</li>
          <li><kbd className="bg-neutral-800 px-2 py-1 rounded text-xs">r</kbd> Ruler</li>
          <li><kbd className="bg-neutral-800 px-2 py-1 rounded text-xs">n</kbd> Add Frame</li>
          <li><kbd className="bg-neutral-800 px-2 py-1 rounded text-xs">space</kbd> Play/Pause</li>
          <li><kbd className="bg-neutral-800 px-2 py-1 rounded text-xs">h</kbd> Toggle Attackers</li>
          <li><kbd className="bg-neutral-800 px-2 py-1 rounded text-xs">j</kbd> Toggle Defenders</li>
          <li><kbd className="bg-neutral-800 px-2 py-1 rounded text-xs">k</kbd> Toggle Tokens</li>
          <li><kbd className="bg-neutral-800 px-2 py-1 rounded text-xs">l</kbd> Toggle Lines</li>
          <li><kbd className="bg-neutral-800 px-2 py-1 rounded text-xs">m</kbd> Toggle Map Objectives</li>
          <li><kbd className="bg-neutral-800 px-2 py-1 rounded text-xs">f</kbd> Toggle Grid</li>
          <li><kbd className="bg-neutral-800 px-2 py-1 rounded text-xs">d</kbd> Delete Selected</li>
          <li><kbd className="bg-neutral-800 px-2 py-1 rounded text-xs">ArrowLeft</kbd> Previous Frame</li>
          <li><kbd className="bg-neutral-800 px-2 py-1 rounded text-xs">ArrowRight</kbd> Next Frame</li>
          <li><kbd className="bg-neutral-800 px-2 py-1 rounded text-xs">ctrl+z</kbd> Undo</li>
          <li><kbd className="bg-neutral-800 px-2 py-1 rounded text-xs">ctrl+shift+z</kbd> Redo</li>
          <li><kbd className="bg-neutral-800 px-2 py-1 rounded text-xs">ctrl+s</kbd> Save</li>
          <li><kbd className="bg-neutral-800 px-2 py-1 rounded text-xs">1-5</kbd> Select Attacker 1-5</li>
          <li><kbd className="bg-neutral-800 px-2 py-1 rounded text-xs">6-0</kbd> Select Defender 1-5</li>
        </ul>
      </Modal>
      <Modal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} title="Settings">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Grid Size</label>
            <input type="range" min="10" max="100" value={gridSize} onChange={(e) => setGridSize(parseInt(e.target.value, 10))} className="w-full" />
            <div className="text-xs text-neutral-400 text-right">{gridSize}px</div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Auto Save Frequency</label>
            <select value={autoSaveFrequency} onChange={(e) => setAutoSaveFrequency(e.target.value as any)} className="w-full bg-neutral-800 text-white rounded p-2 border border-neutral-700">
              <option value="off">Off</option>
              <option value="significant">On Significant Changes</option>
              <option value="frequent">Frequent (Every Action)</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}
