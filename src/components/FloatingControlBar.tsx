import { useState, useRef, useEffect } from 'react';
import { 
  GripHorizontal,
  PanelTop,
  PanelBottom,
  Sidebar as SidebarLeftIcon,
  SidebarClose,
  PanelRight,
  Eye,
  EyeOff
} from 'lucide-react';
import { Tooltip } from './Tooltip';

interface FloatingControlBarProps {
  showTop: boolean;
  setShowTop: (show: boolean) => void;
  showBottom: boolean;
  setShowBottom: (show: boolean) => void;
  showLeft: boolean;
  setShowLeft: (show: boolean) => void;
  showRight: boolean;
  setShowRight: (show: boolean) => void;
}

export function FloatingControlBar({
  showTop,
  setShowTop,
  showBottom,
  setShowBottom,
  showLeft,
  setShowLeft,
  showRight,
  setShowRight
}: FloatingControlBarProps) {
  const [position, setPosition] = useState({ x: 300, y: 150 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number } | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !dragRef.current) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      setPosition({
        x: dragRef.current.initialX + dx,
        y: dragRef.current.initialY + dy
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y
    };
  };

  return (
    <div 
      ref={barRef}
      style={{ left: position.x, top: position.y }}
      className="fixed z-[100] flex flex-col bg-white/90 dark:bg-neutral-900/90 backdrop-blur rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-xl overflow-hidden pointer-events-auto"
    >
      <div 
        onMouseDown={handleMouseDown}
        className="h-6 bg-neutral-200/50 dark:bg-neutral-800/50 flex items-center justify-center cursor-move hover:bg-neutral-300/50 dark:hover:bg-neutral-700/50 transition-colors"
      >
        <GripHorizontal className="w-4 h-4 text-neutral-500" />
      </div>
      
      <div className="flex gap-1 p-2">
        <Tooltip content={showTop ? "Hide Top Bar" : "Show Top Bar"} side="bottom">
          <button
            onClick={() => setShowTop(!showTop)}
            className={`p-1.5 rounded transition-colors ${showTop ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500'}`}
          >
            <PanelTop className="w-4 h-4" />
          </button>
        </Tooltip>
        
        <Tooltip content={showBottom ? "Hide Bottom Bar" : "Show Bottom Bar"} side="bottom">
          <button
            onClick={() => setShowBottom(!showBottom)}
            className={`p-1.5 rounded transition-colors ${showBottom ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500'}`}
          >
            <PanelBottom className="w-4 h-4" />
          </button>
        </Tooltip>

        <div className="w-px h-6 bg-neutral-200 dark:bg-neutral-800 mx-1 my-auto"></div>

        <Tooltip content={showLeft ? "Hide Left Sidebar" : "Show Left Sidebar"} side="bottom">
          <button
            onClick={() => setShowLeft(!showLeft)}
            className={`p-1.5 rounded transition-colors ${showLeft ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500'}`}
          >
            <SidebarLeftIcon className="w-4 h-4" />
          </button>
        </Tooltip>

        <Tooltip content={showRight ? "Hide Right Sidebar" : "Show Right Sidebar"} side="bottom">
          <button
            onClick={() => setShowRight(!showRight)}
            className={`p-1.5 rounded transition-colors ${showRight ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500'}`}
          >
            <PanelRight className="w-4 h-4" />
          </button>
        </Tooltip>
      </div>
    </div>
  );
}
