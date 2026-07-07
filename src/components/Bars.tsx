import { useState } from "react";
import {
  ImagePlay,
  Book,
  Camera,
  ChevronRight,
  Download,
  Film,
  FolderOpen,
  Gamepad2,
  Info,
  Grid3X3,
  Map as MapIcon,
  Maximize2,
  Menu,
  Keyboard,
  Play,
  Pause,
  Plus,
  Redo2,
  Repeat2,
  RotateCcw,
  Save,
  Share2,
  SlidersHorizontal,
  Trash2,
  Undo2,
  Upload,
} from "lucide-react";
import { Tooltip } from "./Tooltip";
import { MapData, GameData } from "../data/maps";

const FrameThumbnail = ({
  frame,
  mapImage,
  isActive,
  onClick,
  index,
}: {
  frame: any[];
  mapImage?: string;
  isActive: boolean;
  onClick: () => void;
  index: number;
}) => {
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });

  return (
    <button
      onClick={onClick}
      className={`relative w-16 h-10 shrink-0 rounded overflow-hidden border-2 transition-all ${
        isActive
          ? "border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
          : "border-white/10 hover:border-white/30"
      }`}
      title={`Frame ${index + 1}`}
    >
      <div className="absolute inset-0 bg-neutral-900" />
      {mapImage && (
        <img
          src={mapImage}
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          alt={`Frame ${index + 1}`}
          onLoad={(e) => {
            const img = e.target as HTMLImageElement;
            setDimensions({
              width: img.naturalWidth || 1920,
              height: img.naturalHeight || 1080,
            });
          }}
        />
      )}

      {frame.map((token) => (
        <div
          key={token.id}
          className="absolute rounded-full shadow-sm"
          style={{
            left: `${(token.x / dimensions.width) * 100}%`,
            top: `${(token.y / dimensions.height) * 100}%`,
            width: "3px",
            height: "3px",
            backgroundColor: token.color || "#fff",
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
      <div className="absolute bottom-0 right-0 bg-black/70 text-[9px] font-bold px-1 rounded-tl text-white">
        {index + 1}
      </div>
    </button>
  );
};

export function TopBar({
  frames,
  currentFrameIndex,
  setCurrentFrameIndex,
  addFrame,
  isPlaying,
  togglePlay,
  isLooping,
  setIsLooping,
  undo,
  redo,
  canUndo,
  canRedo,
  showGrid,
  setShowGrid,
  games,
  maps,
  activeGameId,
  activeMapId,
  onGameChange,
  onMapChange,
  onCustomMapUpload,
  onSave,
  onLoad,
  onSnapshot,
  onExport,
  onImport,
  onExportFramesZip,
  onExportGif,
  onDeleteFrame,
  onReset,
  autoSaveFrequency,
  animationSpeed,
  setAnimationSpeed,
  setAutoSaveFrequency,
}: {
  frames: any[];
  currentFrameIndex: number;
  setCurrentFrameIndex: (idx: number) => void;
  addFrame: () => void;
  isPlaying: boolean;
  togglePlay: () => void;
  isLooping?: boolean;
  setIsLooping?: (val: boolean) => void;
  undo?: () => void;
  redo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  showGrid?: boolean;
  setShowGrid?: (show: boolean) => void;
  games?: GameData[];
  maps?: MapData[];
  activeGameId?: string;
  activeMapId?: string;
  onGameChange?: (id: string) => void;
  onMapChange?: (id: string) => void;
  onCustomMapUpload?: (name: string, imageData: string) => void;
  onSave?: () => void;
  onLoad?: () => void;
  onReset?: () => void;
  onSnapshot?: () => void;
  onExport?: () => void;
  onImport?: () => void;
  onExportFramesZip?: () => void;
  onExportGif?: () => void;
  onDeleteFrame?: () => void;
  animationSpeed?: number;
  setAnimationSpeed?: (speed: number) => void;
  autoSaveFrequency?: "frequent" | "significant" | "off";
  setAutoSaveFrequency?: (freq: "frequent" | "significant" | "off") => void;
}) {
  const activeMap = maps?.find((m) => m.id === activeMapId);
  const [isMinimized, setIsMinimized] = useState(false);
  if (isMinimized)
    return (
      <div className="absolute top-2 left-2 z-20 pointer-events-auto">
        <button
          onClick={() => setIsMinimized(false)}
          className="px-2 py-1 bg-black/40 backdrop-blur rounded-lg border border-white/10 text-white hover:bg-white/10 text-xs font-bold"
        >
          + Top Bar
        </button>
      </div>
    );
  return (
    <div className="absolute top-0 left-0 w-full z-20 flex justify-between p-2 pointer-events-none">

      <div className="flex flex-col gap-2 pointer-events-auto">
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black dark:bg-white rounded flex items-center justify-center">
              <span className="text-white dark:text-black font-bold text-xs">
                CS
              </span>
            </div>
            <span className="font-bold hidden xl:block text-white">
              Tactical Board
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 text-sm text-neutral-300 font-medium bg-black/40 backdrop-blur rounded-lg px-3 py-1.5 border border-white/10">
            <Gamepad2 className="w-4 h-4" />
            {games && onGameChange ? (
              <select
                value={activeGameId}
                onChange={(e) => onGameChange(e.target.value)}
                className="bg-transparent border-none text-neutral-300 font-medium outline-none cursor-pointer text-sm"
              >
                {games.map((g) => (
                  <option key={g.id} value={g.id} className="text-black">
                    {g.name}
                  </option>
                ))}
              </select>
            ) : (
              <span>Esports</span>
            )}
            <ChevronRight className="w-4 h-4" />
            <MapIcon className="w-4 h-4 text-blue-400" />
            {maps && onMapChange ? (
              <select
                value={activeMapId}
                onChange={(e) => onMapChange(e.target.value)}
                className="bg-transparent border-none text-blue-400 font-medium outline-none cursor-pointer text-sm"
              >
                {maps.length > 0 ? (
                  maps.map((m) => (
                    <option key={m.id} value={m.id} className="text-black">
                      {m.name}
                    </option>
                  ))
                ) : (
                  <option disabled value="" className="text-black">
                    No Custom Maps
                  </option>
                )}
              </select>
            ) : (
              <span className="text-blue-400">Map Selection</span>
            )}
            {activeGameId === "custom" && onCustomMapUpload && (
              <button
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/*";
                  input.onchange = (e: any) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        onCustomMapUpload(
                          file.name.replace(/\.[^/.]+$/, ""),
                          event.target?.result as string,
                        );
                      };
                      reader.readAsDataURL(file);
                    }
                  };
                  input.click();
                }}
                className="ml-1 p-1 bg-white/10 hover:bg-white/20 rounded flex items-center justify-center"
                title="Upload Custom Map"
              >
                <Upload className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Frame Timeline (Top Center) */}
      <div className="absolute top-2 left-1 right-1 w-fit place-self-center pointer-events-auto">
        <div className="flex items-center gap-2 bg-black/60 text-neutral-300 backdrop-blur rounded-lg border border-white/10 p-1 shadow-lg">
          <Tooltip content="Play Animation" side="bottom">
            <button
              onClick={togglePlay}
              className="p-1.5 hover:bg-white/10 rounded transition-colors text-white"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </button>
          </Tooltip>
          <button
            onClick={() => setIsLooping && setIsLooping(!isLooping)}
            className={`p-1.5 rounded transition-colors ${isLooping ? "bg-blue-600/30 text-blue-400" : "hover:bg-white/10 text-neutral-400"}`}
            title="Continuous Loop"
          >
            <Repeat2 className="w-4 h-4" />
          </button>
          {animationSpeed && setAnimationSpeed && (
            <select
              value={animationSpeed}
              onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
              className="bg-transparent text-xs py-1 px-1.5 text-neutral-300 outline-none hover:bg-white/10 rounded cursor-pointer text-center"
              title="Animation Speed"
              style={{ WebkitAppearance: "none", MozAppearance: "none" }}
            >
              <option value="0.25" className="bg-neutral-800">
                0.25x
              </option>
              <option value="0.5" className="bg-neutral-800">
                0.5x
              </option>
              <option value="1" className="bg-neutral-800">
                1x
              </option>
              <option value="1.5" className="bg-neutral-800">
                1.5x
              </option>
              <option value="2" className="bg-neutral-800">
                2x
              </option>
            </select>
          )}
          <div className="h-4 w-px bg-white/20 mx-1"></div>
          <div className="flex gap-1 overflow-x-auto max-w-75 no-scrollbar">
            {frames.map((frame, i) => (
              <FrameThumbnail
                key={i}
                frame={frame}
                mapImage={activeMap?.image}
                isActive={currentFrameIndex === i}
                onClick={() => setCurrentFrameIndex(i)}
                index={i}
              />
            ))}
          </div>
          <div className="h-4 w-px bg-white/20 mx-1"></div>
          <Tooltip content="Add New Frame" side="bottom">
            <button
              onClick={addFrame}
              className="p-1.5 hover:bg-white/10 rounded transition-colors text-blue-400"
            >
              <Plus className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip content="Delete Current Frame" side="bottom">
            <button
              onClick={onDeleteFrame}
              disabled={frames.length <= 1}
              className={`p-1.5 rounded transition-colors ${frames.length <= 1 ? "opacity-50 cursor-not-allowed text-neutral-500" : "hover:bg-white/10 text-red-400"}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>
      </div>

      <div className="flex gap-2 pointer-events-auto items-start">
        <div className="flex bg-black/40 text-neutral-300 backdrop-blur rounded-lg border border-white/10 p-1 gap-1">
          <Tooltip content="Undo (Ctrl+Z)" side="bottom">
            <button
              onClick={undo}
              disabled={!canUndo}
              className={`p-1.5 rounded transition-colors ${canUndo ? "hover:bg-white/10 text-white" : "opacity-50 cursor-not-allowed"}`}
            >
              <Undo2 className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip content="Redo (Ctrl+Shift+Z)" side="bottom">
            <button
              onClick={redo}
              disabled={!canRedo}
              className={`p-1.5 rounded transition-colors ${canRedo ? "hover:bg-white/10 text-white" : "opacity-50 cursor-not-allowed"}`}
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>

        <div className="flex bg-black/40 text-neutral-300 backdrop-blur rounded-lg border border-white/10 p-1 gap-1">
          <Tooltip content="Load Strategy" side="bottom">
            <button
              onClick={onLoad}
              className="p-1.5 hover:bg-white/10 rounded transition-colors"
            >
              <FolderOpen className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip content="Save Strategy" side="bottom">
            <button
              onClick={onSave}
              className="p-1.5 hover:bg-white/10 rounded transition-colors"
            >
              <Save className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip content="Reset Strategy" side="bottom">
            <button
              onClick={onReset}
              className="p-1.5 hover:bg-white/10 rounded text-red-400 hover:text-red-300 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>

        {autoSaveFrequency && setAutoSaveFrequency && (
          <div className="flex items-center gap-1.5 text-xs text-neutral-300 font-medium bg-black/40 backdrop-blur rounded-lg px-2 py-1.5 border border-white/10">
            <span>Auto-save:</span>
            <select
              value={autoSaveFrequency}
              onChange={(e) => setAutoSaveFrequency(e.target.value as any)}
              className="bg-transparent border-none text-blue-400 outline-none cursor-pointer"
            >
              <option value="frequent" className="text-black">
                Frequent
              </option>
              <option value="significant" className="text-black">
                Significant
              </option>
              <option value="off" className="text-black">
                Off
              </option>
            </select>
          </div>
        )}

        <div className="flex bg-black/40 text-neutral-300 backdrop-blur rounded-lg border border-white/10 p-1 gap-1">
          <Tooltip content="Take Snapshot" side="bottom">
            <button
              className="p-1.5 hover:bg-white/10 rounded transition-colors"
              onClick={onSnapshot}
            >
              <Camera className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip content="Export as MP4/WebM" side="bottom">
            <button
              className="p-1.5 hover:bg-white/10 rounded transition-colors"
              onClick={onExportFramesZip}
            >
              <Film className="w-4 h-4 text-blue-400" />
            </button>
          </Tooltip>
          <Tooltip content="Export as GIF" side="bottom">
            <button
              className="p-1.5 hover:bg-white/10 rounded transition-colors"
              onClick={onExportGif}
            >
              <ImagePlay className="w-4 h-4 text-pink-400" />
            </button>
          </Tooltip>
          <Tooltip content="Import Strategy JSON" side="bottom">
            <button
              onClick={onImport}
              className="p-1.5 hover:bg-white/10 rounded transition-colors"
            >
              <Upload className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip content="Export Strategy JSON" side="bottom">
            <button
              onClick={onExport}
              className="p-1.5 hover:bg-white/10 rounded transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip content="Share Strategy" side="bottom">
            <button
              className="p-1.5 hover:bg-white/10 rounded transition-colors"
              onClick={() => {
                if (navigator.share) {
                  navigator
                    .share({
                      title: "Tactical Board Strategy",
                      text: "Check out this strategy!",
                      url: window.location.href,
                    })
                    .catch(console.error);
                } else {
                  alert("Sharing is not supported on this browser.");
                }
              }}
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

interface BottomBarProps {
  gameMode: string;
  setGameMode: (mode: string) => void;
  maps?: MapData[];
  activeMapId?: string;
  onShowShortcuts?: () => void;
  onShowSettings?: () => void;
}

export function BottomBar({
  gameMode,
  setGameMode,
  maps,
  activeMapId,
  onShowShortcuts,
  onShowSettings,
}: BottomBarProps) {
  const activeMap = maps?.find((m) => m.id === activeMapId);
  const supportedModes = activeMap?.supportedModes || [
    "SND",
    "HP",
    "DOM",
    "CTL",
    "TDM",
    "LINEUPS",
  ];
  const [isMinimized, setIsMinimized] = useState(false);
  if (isMinimized)
    return (
      <div className="absolute bottom-2 left-2 z-20 pointer-events-auto">
        <button
          onClick={() => setIsMinimized(false)}
          className="px-2 py-1 bg-black/40 backdrop-blur rounded-lg border border-white/10 text-white hover:bg-white/10 text-xs font-bold"
        >
          + Bottom Bar
        </button>
      </div>
    );
  return (
    <div className="absolute bottom-2 left-0 w-full z-20 flex justify-between px-2 pointer-events-none">
      <div className="flex gap-2 pointer-events-auto items-end relative">
        <div className="flex gap-1 bg-black/40 text-neutral-300 backdrop-blur rounded-lg border border-white/10 p-1 flex-wrap max-w-md">
          {supportedModes.includes("SND") && (
            <button
              onClick={() => setGameMode("SND")}
              className={`px-2 py-1 text-xs font-bold rounded transition-colors ${gameMode === "SND" ? "bg-blue-600 text-white" : "hover:bg-white/10"}`}
            >
              S&D
            </button>
          )}
          {supportedModes.includes("HP") && (
            <button
              onClick={() => setGameMode("HP")}
              className={`px-2 py-1 text-xs font-bold rounded transition-colors ${gameMode === "HP" ? "bg-blue-600 text-white" : "hover:bg-white/10"}`}
            >
              HP
            </button>
          )}
          {supportedModes.includes("DOM") && (
            <button
              onClick={() => setGameMode("DOM")}
              className={`px-2 py-1 text-xs font-bold rounded transition-colors ${gameMode === "DOM" ? "bg-blue-600 text-white" : "hover:bg-white/10"}`}
            >
              DOM
            </button>
          )}
          {supportedModes.includes("CTL") && (
            <button
              onClick={() => setGameMode("CTL")}
              className={`px-2 py-1 text-xs font-bold rounded transition-colors ${gameMode === "CTL" ? "bg-blue-600 text-white" : "hover:bg-white/10"}`}
            >
              CTL
            </button>
          )}
          {supportedModes.includes("TDM") && (
            <button
              onClick={() => setGameMode("TDM")}
              className={`px-2 py-1 text-xs font-bold rounded transition-colors ${gameMode === "TDM" ? "bg-blue-600 text-white" : "hover:bg-white/10"}`}
            >
              TDM
            </button>
          )}
          {supportedModes.includes("BR") && (
            <button
              onClick={() => setGameMode("BR")}
              className={`px-2 py-1 text-xs font-bold rounded transition-colors ${gameMode === "BR" ? "bg-blue-600 text-white" : "hover:bg-white/10"}`}
            >
              BR
            </button>
          )}
          {supportedModes.includes("Resurgence") && (
            <button
              onClick={() => setGameMode("Resurgence")}
              className={`px-2 py-1 text-xs font-bold rounded transition-colors ${gameMode === "Resurgence" ? "bg-blue-600 text-white" : "hover:bg-white/10"}`}
            >
              RESURGENCE
            </button>
          )}
          {supportedModes.includes("LINEUPS") && (
            <button
              onClick={() => setGameMode("LINEUPS")}
              className={`px-2 py-1 text-xs font-bold rounded transition-colors ${gameMode === "LINEUPS" ? "bg-blue-600 text-white" : "hover:bg-white/10"}`}
            >
              LINEUPS
            </button>
          )}
        </div>

        {/* {gameMode === "SND" && (
          <div className="flex gap-1 bg-black/40 text-neutral-300 backdrop-blur rounded-lg border border-white/10 p-1">
            <div
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("token_type", "bomb");
              }}
              className="w-8 h-8 flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-white/10 rounded p-1"
              title="Bomb"
            >
              <div className="w-5 h-5 rounded bg-red-600 border border-red-800 flex items-center justify-center text-[8px] font-bold text-white shadow-md">
                BOMB
              </div>
            </div>
          </div>
        )} */}
      </div>

      <div className="flex gap-2 pointer-events-auto items-end pr-22">
        <div className="flex gap-1 bg-black/40 text-neutral-300 backdrop-blur rounded-lg border border-white/10 p-1">
          <Tooltip content="Keyboard Shortcuts" side="bottom">
            <button
              onClick={onShowShortcuts}
              className="p-1.5 hover:bg-white/10 rounded transition-colors"
            >
              <Keyboard className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip content="Take Screenshot" side="top">
            <button
              onClick={() => {
                const canvas = document.querySelector("canvas");
                if (canvas) {
                  const url = canvas.toDataURL("image/png");
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "tacmap.png";
                  a.click();
                }
              }}
              className="p-1.5 hover:bg-white/10 rounded transition-colors"
            >
              <Camera className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip content="Toggle Fullscreen" side="top">
            <button
              onClick={() => {
                if (!document.fullscreenElement) {
                  document.documentElement.requestFullscreen();
                } else {
                  document.exitFullscreen();
                }
              }}
              className="p-1.5 hover:bg-white/10 rounded transition-colors"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 mb-2 pointer-events-auto"></div>
    </div>
  );
}
