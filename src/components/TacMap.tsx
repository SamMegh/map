import React, { useRef, useState, useEffect } from "react";
import { Tooltip } from "./Tooltip";
import {
  Stage,
  Layer,
  Line,
  RegularPolygon,
  Group,
  Circle,
  Text,
  Path,
  Rect,
  Image as KonvaImage,
  Arrow,
} from "react-konva";
import useImage from "use-image";
import { ZoomIn, ZoomOut, Maximize } from "lucide-react";
import { LineData, TokenData, ToolType, MapObjectives } from "../types";

interface TacMapProps {
  tool: ToolType;
  color: string;
  showAttackers: boolean;
  showDefenders: boolean;
  showObjectives: boolean;
  showMapObjectives: boolean;
  showLines: boolean;
  showGrid?: boolean;
  gridSize?: number;
  tokens: TokenData[];
  setTokens: (
    tokens: TokenData[] | ((prev: TokenData[]) => TokenData[]),
  ) => void;
  lines: LineData[];
  setLines: (lines: LineData[] | ((prev: LineData[]) => LineData[])) => void;
  selectedItemIds: string[];
  setSelectedItemIds: (ids: string[]) => void;
  isLocked?: boolean;
  gameMode?: string;
  mapObjectives?: MapObjectives;
  setMapObjectives?: (objectives: MapObjectives) => void;
  mapImageUrl?: string;
  onHistoryPush?: () => void;
  stageRef?: React.RefObject<any>;
}

export function TacMap({
  tool,
  color,
  showAttackers,
  showDefenders,
  showObjectives,
  showMapObjectives,
  showLines,
  showGrid = false,
  gridSize = 20,
  tokens,
  setTokens,
  lines,
  setLines,
  selectedItemIds,
  setSelectedItemIds,
  isLocked,
  gameMode,
  mapObjectives,
  setMapObjectives,
  mapImageUrl,
  onHistoryPush,
  stageRef,
}: TacMapProps) {
  const ICON_SCALE = 2;

  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [mapImage] = useImage(
    mapImageUrl ||
      "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1920&q=80",
    "anonymous",
  );

  const isDrawing = useRef(false);

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [selectionBox, setSelectionBox] = useState<{
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  } | null>(null);
  const lastPanPos = useRef({ x: 0, y: 0 });

  const MAP_WIDTH = mapImage ? mapImage.width : 1920;
  const MAP_HEIGHT = mapImage ? mapImage.height : 1080;

  const scaleX = dimensions.width / MAP_WIDTH;
  const scaleY = dimensions.height / MAP_HEIGHT;
  const baseMapScale = Math.min(scaleX, scaleY) * 0.95;
  const baseMapX = (dimensions.width - MAP_WIDTH * baseMapScale) / 2;
  const baseMapY = (dimensions.height - MAP_HEIGHT * baseMapScale) / 2;

  const mapScale = baseMapScale * zoom;
  const mapX = baseMapX * zoom + pan.x;
  const mapY = baseMapY * zoom + pan.y;

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions((prev) => {
          if (prev.width === window.innerWidth && prev.height === window.innerHeight)
            return prev;
          return {
            width: window.innerWidth,
            height: window.innerHeight,
          };
        });
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    const handleZoomIn = () => {
      setZoom((prev) => prev * 1.1);
      setPan((prev) => ({
        x: prev.x - (dimensions.width / 2 - mapX) * (1.1 - 1),
        y: prev.y - (dimensions.height / 2 - mapY) * (1.1 - 1),
      }));
    };

    const handleZoomOut = () => {
      setZoom((prev) => prev / 1.1);
      setPan((prev) => ({
        x: prev.x - (dimensions.width / 2 - mapX) * (1 / 1.1 - 1),
        y: prev.y - (dimensions.height / 2 - mapY) * (1 / 1.1 - 1),
      }));
    };

    window.addEventListener("zoom-in", handleZoomIn);
    window.addEventListener("zoom-out", handleZoomOut);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("zoom-in", handleZoomIn);
      window.removeEventListener("zoom-out", handleZoomOut);
    };
  }, [dimensions, mapX, mapY]);

  const snap = (v: number) => (showGrid ? Math.round(v / gridSize) * gridSize : v);

  const handleMouseDown = (e: any) => {
    const isRightClick = e.evt && e.evt.button === 2;
    if (isRightClick) {
      const pos = e.target.getStage().getPointerPosition();
      if (pos)
        setSelectionBox({
          startX: pos.x,
          startY: pos.y,
          endX: pos.x,
          endY: pos.y,
        });
      return;
    }
    if (isLocked) return;

    const isMiddleButton = e.evt && e.evt.button === 1;
    const isBackgroundClick = e.target === e.target.getStage() || e.target.name() === "background";

    if (isMiddleButton || (tool === "select" && isBackgroundClick)) {
      setIsPanning(true);
      const pos = e.target.getStage().getPointerPosition();
      lastPanPos.current = { x: pos.x, y: pos.y };
      document.body.style.cursor = "grabbing";
      if (isBackgroundClick) {
        setSelectedItemIds([]);
      }
      return;
    }

    // If clicking on stage, deselect
    if (e.target === e.target.getStage()) {
      setSelectedItemIds([]);
    }

    if (tool === "select" || tool === "eraser") return;

    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    let rawX = (pos.x - mapX) / mapScale;
    let rawY = (pos.y - mapY) / mapScale;
    const x = snap(rawX);
    const y = snap(rawY);

    if (tool === "image" || tool === "mic") {
      setLines([
        ...lines,
        {
          id: Date.now().toString(),
          tool,
          points: [x, y],
          color,
          text: tool === "image" ? "Image URL" : "Audio URL",
        },
      ]);
      isDrawing.current = false;
      return;
    }

    const isTokenSelected = tokens.some((t) => selectedItemIds.includes(t.id));
    const attachedTokenId =
      isTokenSelected && selectedItemIds.length === 1 ? selectedItemIds[0] : undefined;

    setLines([
      ...lines,
      {
        id: Date.now().toString(),
        tool,
        points:
          tool === "square" ||
          tool === "circle" ||
          tool === "ruler" ||
          tool === "arrow"
            ? [x, y, x, y]
            : [x, y],
        color: color,
        text: tool === "text" ? "New Text" : undefined,
        attachedTokenId:
          tool === "pen" ||
          tool === "polygon" ||
          tool === "arrow" ||
          tool === "ruler"
            ? attachedTokenId
            : undefined,
      },
    ]);
  };

  const handleMouseMove = (e: any) => {
    if (selectionBox) {
      const pos = e.target.getStage().getPointerPosition();
      if (pos) setSelectionBox((prev) => (prev ? { ...prev, endX: pos.x, endY: pos.y } : null));
      return;
    }
    if (isLocked) return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();

    if (isPanning) {
      const dx = point.x - lastPanPos.current.x;
      const dy = point.y - lastPanPos.current.y;
      setPan((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      lastPanPos.current = { x: point.x, y: point.y };
      return;
    }

    if (!isDrawing.current) return;
    if (tool === "select" || tool === "image" || tool === "mic") return;

    const rawX = (point.x - mapX) / mapScale;
    const rawY = (point.y - mapY) / mapScale;
    const x = snap(rawX);
    const y = snap(rawY);
    let lastLine = { ...lines[lines.length - 1] };

    if (tool === "pen" || tool === "eraser" || tool === "polygon") {
      lastLine.points = [...lastLine.points, x, y];
    } else if (tool === "square" || tool === "circle" || tool === "ruler" || tool === "arrow") {
      lastLine.points = [lastLine.points[0], lastLine.points[1], x, y];
    } else if (tool === "text") {
      lastLine.points = [x, y];
    }

    const newLines = [...lines];
    newLines[newLines.length - 1] = lastLine;
    setLines(newLines);
  };

  const handleMouseUp = (e: any) => {
    if (selectionBox) {
      if (setSelectedItemIds) {
        const minX = Math.min(selectionBox.startX, selectionBox.endX);
        const maxX = Math.max(selectionBox.startX, selectionBox.endX);
        const minY = Math.min(selectionBox.startY, selectionBox.endY);
        const maxY = Math.max(selectionBox.startY, selectionBox.endY);

        const toMapCoordsX = (scrX: number) => (scrX - mapX) / mapScale;
        const toMapCoordsY = (scrY: number) => (scrY - mapY) / mapScale;

        const rectMinX = toMapCoordsX(minX);
        const rectMaxX = toMapCoordsX(maxX);
        const rectMinY = toMapCoordsY(minY);
        const rectMaxY = toMapCoordsY(maxY);

        const newSelectedIds: string[] = [];
        tokens.forEach((t) => {
          if (t.x >= rectMinX && t.x <= rectMaxX && t.y >= rectMinY && t.y <= rectMaxY) newSelectedIds.push(t.id);
        });

        lines.forEach((l) => {
          if (l.points && l.points.length >= 2) {
            const bx = l.points[0];
            const by = l.points[1];
            if (bx >= rectMinX && bx <= rectMaxX && by >= rectMinY && by <= rectMaxY) newSelectedIds.push(l.id);
          }
        });

        if (e && e.evt && e.evt.shiftKey) {
          setSelectedItemIds(Array.from(new Set([...selectedItemIds, ...newSelectedIds])));
        } else {
          setSelectedItemIds(newSelectedIds);
        }
      }
      setSelectionBox(null);
      return;
    }
    if (isPanning) {
      setIsPanning(false);
      document.body.style.cursor = "default";
      return;
    }
    if (isDrawing.current) {
      isDrawing.current = false;
      if (onHistoryPush) onHistoryPush();
    }
  };

  const handleWheel = (e: any) => {
    e.evt.preventDefault();

    const scaleBy = 1.1;
    const stage = e.target.getStage();
    const oldZoom = zoom;

    const pointer = stage.getPointerPosition();

    const mousePointTo = {
      x: (pointer.x - mapX) / mapScale,
      y: (pointer.y - mapY) / mapScale,
    };

    const newZoom = e.evt.deltaY < 0 ? oldZoom * scaleBy : oldZoom / scaleBy;
    const newMapScale = baseMapScale * newZoom;

    setZoom(newZoom);
    setPan({
      x: pointer.x - mousePointTo.x * newMapScale - baseMapX * newZoom,
      y: pointer.y - mousePointTo.y * newMapScale - baseMapY * newZoom,
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    if (isLocked) return;
    e.preventDefault();
    if (!containerRef.current) return;

    const stage = containerRef.current.querySelector("canvas");
    if (!stage) return;

    const rect = stage.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    const rawX = (clientX - mapX) / mapScale;
    const rawY = (clientY - mapY) / mapScale;
    const x = snap(rawX);
    const y = snap(rawY);

    const tokenType = e.dataTransfer.getData("tokenType") as any;
    if (tokenType) {
      setTokens([
        ...tokens,
        {
          id: Date.now().toString(),
          type: tokenType,
          x,
          y,
          rotation: 0,
          color: color,
          label: tokenType === "choke" ? `${tokens.filter((t) => t.type === "choke").length + 1}` : undefined,
        },
      ]);
      if (onHistoryPush) onHistoryPush();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragEnd = (e: any, id: string) => {
    if (isLocked) return;
    if (e.target !== e.currentTarget) return;
    setTokens((prev) =>
      prev.map((t) => {
        if (t.id === id) return { ...t, x: snap(e.target.x()), y: snap(e.target.y()) };
        return t;
      }),
    );
  };

  const gridLines: React.ReactNode[] = [];
  if (showGrid || !mapImage) {
    const actualGridSize = showGrid ? gridSize : 50;
    for (let i = 0; i < MAP_WIDTH / actualGridSize; i++) {
      gridLines.push(
        <Line
          key={`v${i}`}
          points={[Math.round(i * actualGridSize) + 0.5, 0, Math.round(i * actualGridSize) + 0.5, MAP_HEIGHT]}
          stroke={showGrid ? "#ffffff" : "#333"}
          strokeWidth={1}
          opacity={showGrid ? 0.2 : 0.3}
        />,
      );
    }
    for (let j = 0; j < MAP_HEIGHT / actualGridSize; j++) {
      gridLines.push(
        <Line
          key={`h${j}`}
          points={[0, Math.round(j * actualGridSize) + 0.5, MAP_WIDTH, Math.round(j * actualGridSize) + 0.5]}
          stroke={showGrid ? "#ffffff" : "#333"}
          strokeWidth={1}
          opacity={showGrid ? 0.2 : 0.3}
        />,
      );
    }
  }

  return (
    <div
      ref={containerRef}
      onContextMenu={(e) => e.preventDefault()}
      className="relative w-full h-full bg-[#111111]"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <Stage
        ref={stageRef}
        width={dimensions.width}
        height={dimensions.height}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        onWheel={handleWheel}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
      >
        <Layer>
          <Rect width={dimensions.width} height={dimensions.height} fill="#1a1a1a" name="background" />
          {selectionBox && (
            <Rect
              x={Math.min(selectionBox.startX, selectionBox.endX)}
              y={Math.min(selectionBox.startY, selectionBox.endY)}
              width={Math.abs(selectionBox.endX - selectionBox.startX)}
              height={Math.abs(selectionBox.endY - selectionBox.startY)}
              fill="rgba(0, 161, 255, 0.3)"
              stroke="#00A1FF"
              strokeWidth={1}
              listening={false}
            />
          )}
        </Layer>

        <Layer x={mapX} y={mapY} scaleX={mapScale} scaleY={mapScale}>
          {mapImage && <KonvaImage image={mapImage} x={0} y={0} />}
          {gridLines.length > 0 && gridLines}
        </Layer>

        <Layer x={mapX} y={mapY} scaleX={mapScale} scaleY={mapScale}>
          {lines.map((line, i) => {
            const isSelected = selectedItemIds.includes(line.id) && !isLocked;
            const strokeColor = isSelected ? "#3b82f6" : line.color;
            const strokeWidth = isSelected ? 6 : line.tool === "eraser" ? 20 : 4;

            const handleInteract = (e: any) => {
              if (tool === "select" && setSelectedItemIds && !isLocked) {
                setSelectedItemIds(e ? (e.evt.shiftKey ? [...selectedItemIds, line.id] : [line.id]) : [line.id]);
              } else if (tool === "eraser" && !isLocked) {
                setLines((prev) => prev.filter((l) => l.id !== line.id));
              }
            };

            const handleDblClick = () => {
              if (line.tool === "text" && !isLocked) {
                const newText = window.prompt("Edit text:", line.text || "Text");
                if (newText !== null) {
                  const updatedLines = [...lines];
                  updatedLines[i] = { ...line, text: newText };
                  setLines(updatedLines);
                  if (onHistoryPush) onHistoryPush();
                }
              }
            };

            const handleHover = (e: any) => {
              if (tool === "eraser" && !isLocked && e.evt.buttons === 1) {
                setLines((prev) => prev.filter((l) => l.id !== line.id));
              }
            };

            const commonProps = {
              visible: showLines,
              stroke: strokeColor,
              strokeWidth: strokeWidth,
              onClick: handleInteract,
              onTap: handleInteract,
              onDblClick: handleDblClick,
              onDblTap: handleDblClick,
              onPointerEnter: handleHover,
              draggable: tool === "select" && !isLocked,
              onDragEnd: (e: any) => {
                if (isLocked) return;
                const node = e.target;
                const newPoints = [...line.points];
                let originalX = 0;
                let originalY = 0;
                if (line.tool === "square") {
                  originalX = Math.min(line.points[0], line.points[2]);
                  originalY = Math.min(line.points[1], line.points[3]);
                } else if (
                  line.tool === "circle" ||
                  line.tool === "text" ||
                  line.tool === "image" ||
                  line.tool === "mic"
                ) {
                  originalX = line.points[0];
                  originalY = line.points[1];
                }
                const dx = node.x() - originalX;
                const dy = node.y() - originalY;
                node.position({ x: originalX, y: originalY });

                if (line.tool === "square" || line.tool === "circle" || line.tool === "arrow" || line.tool === "ruler") {
                  newPoints[0] += dx;
                  newPoints[1] += dy;
                  if (newPoints.length > 2) {
                    newPoints[2] += dx;
                    newPoints[3] += dy;
                  }
                } else if (line.tool === "text" || line.tool === "image" || line.tool === "mic") {
                  newPoints[0] += dx;
                  newPoints[1] += dy;
                } else {
                  for (let j = 0; j < newPoints.length; j += 2) {
                    newPoints[j] += dx;
                    newPoints[j + 1] += dy;
                  }
                }

                const updatedLines = [...lines];
                updatedLines[i] = { ...line, points: newPoints };
                setLines(updatedLines);
                if (onHistoryPush) onHistoryPush();
              },
            };

            if (line.tool === "square") {
              const [x1, y1, x2, y2] = line.points;
              if (x2 === undefined) return null;
              return (
                <Rect
                  key={line.id}
                  x={Math.min(x1, x2)}
                  y={Math.min(y1, y2)}
                  width={Math.abs(x2 - x1)}
                  height={Math.abs(y2 - y1)}
                  {...commonProps}
                />
              );
            }

            if (line.tool === "circle") {
              const [x1, y1, x2, y2] = line.points;
              if (x2 === undefined) return null;
              const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
              return <Circle key={line.id} x={x1} y={y1} radius={radius} {...commonProps} />;
            }

            if (line.tool === "arrow") {
              if (line.points.length < 4 || (line.points[0] === line.points[2] && line.points[1] === line.points[3])) return null;
              return <Arrow key={line.id} x={0} y={0} points={line.points} pointerLength={15} pointerWidth={15} fill={strokeColor} {...commonProps} />;
            }

            if (line.tool === "ruler") {
              const [x1, y1, x2, y2] = line.points;
              if (x2 === undefined) return null;
              const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
              const distanceInMeters = Math.round(distance / 10);
              const midX = (x1 + x2) / 2;
              const midY = (y1 + y2) / 2;
              return (
                <Group key={line.id} {...commonProps} stroke={undefined} strokeWidth={undefined}>
                  <Line points={line.points} stroke={strokeColor} strokeWidth={commonProps.strokeWidth} dash={[10, 5]} />
                  <Rect x={midX - 25} y={midY - 15} width={50} height={30} fill="#111" cornerRadius={4} opacity={0.8} />
                  <Text x={midX - 20} y={midY - 8} text={`${distanceInMeters}m`} fontSize={16} fill="white" fontStyle="bold" />
                </Group>
              );
            }

            if (line.tool === "text") {
              return <Text key={line.id} x={line.points[0]} y={line.points[1]} text={line.text || "Text"} fontSize={24} fill={strokeColor} {...commonProps} stroke={undefined} strokeWidth={undefined} />;
            }

            if (line.tool === "image") {
              return (
                <Group key={line.id} x={line.points[0]} y={line.points[1]} {...commonProps} stroke={undefined} strokeWidth={undefined}>
                  <Rect width={100} height={100} fill="#222" stroke={strokeColor} strokeWidth={2} />
                  <Text x={5} y={40} text="🖼️ Image" fill="white" fontSize={20} />
                </Group>
              );
            }

            if (line.tool === "mic") {
              return (
                <Group key={line.id} x={line.points[0]} y={line.points[1]} {...commonProps} stroke={undefined} strokeWidth={undefined}>
                  <Circle radius={30} fill="#222" stroke={strokeColor} strokeWidth={2} />
                  <Text x={-15} y={-10} text="🎤" fill="white" fontSize={24} />
                </Group>
              );
            }

            return (
              <Line
                key={line.id}
                {...commonProps}
                points={line.points}
                tension={line.tool === "polygon" ? 0 : 0.5}
                lineCap="round"
                lineJoin="round"
                closed={line.tool === "polygon" && line.points.length > 4}
                globalCompositeOperation={line.tool === "eraser" ? "destination-out" : "source-over"}
                hitStrokeWidth={15}
              />
            );
          })}
        </Layer>

        {/* Tokens / map icons (2x) */}
        <Layer x={mapX} y={mapY} scaleX={mapScale} scaleY={mapScale}>
          {tokens.map((token) => {
            const isDraggable = tool === "select" && !isLocked;
            const isSelected = selectedItemIds.includes(token.id) && !isLocked;

            const scale = token.scale || 1;
            const fov = token.fov || 90;
            const visionLength = (token.visionLength || 100) * ICON_SCALE;

            const handleSelect = (e: any) => {
              if (tool === "select" && setSelectedItemIds && !isLocked) {
                setSelectedItemIds(e ? (e.evt.shiftKey ? [...selectedItemIds, token.id] : [token.id]) : [token.id]);
              } else if (tool === "eraser" && !isLocked) {
                setTokens((prev) => prev.filter((t) => t.id !== token.id));
              }
            };

            const handleTokenHover = (e: any) => {
              if (tool === "eraser" && !isLocked && e.evt.buttons === 1) {
                setTokens((prev) => prev.filter((t) => t.id !== token.id));
              }
            };

            const renderVisionCone = (baseColor: string, rotationOffset: number) => {
              if (token.showCone === false) return null;
              const angleStart = -fov / 2;
              const angleEnd = fov / 2;

              let r = 255,
                g = 255,
                b = 255;
              if (baseColor.startsWith("rgba")) {
                const parts = baseColor.match(/rgba\((\d+),\s*(\d+),\s*(\d+)/);
                if (parts) {
                  r = parseInt(parts[1]);
                  g = parseInt(parts[2]);
                  b = parseInt(parts[3]);
                }
              } else if (baseColor.startsWith("#")) {
                const hex = baseColor.substring(1);
                r = parseInt(hex.substring(0, 2), 16);
                g = parseInt(hex.substring(2, 4), 16);
                b = parseInt(hex.substring(4, 6), 16);
              }

              const opacity = token.visionOpacity ?? 0.15;
              const fill = `rgba(${r}, ${g}, ${b}, ${opacity})`;

              return (
                <Path
                  data={`M 0 0 L ${visionLength * Math.cos((angleStart * Math.PI) / 180)} ${visionLength * Math.sin((angleStart * Math.PI) / 180)} A ${visionLength} ${visionLength} 0 0 1 ${visionLength * Math.cos((angleEnd * Math.PI) / 180)} ${visionLength * Math.sin((angleEnd * Math.PI) / 180)} Z`}
                  fill={fill}
                  rotation={rotationOffset - 90}
                />
              );
            };

            const rotHandleDist = 30 * ICON_SCALE;
            const rotHandleRadius = 12 * ICON_SCALE;

            if (token.type === "attacker") {
              if (!showAttackers) return null;
              const angleRad = ((token.rotation + 90) * Math.PI) / 180;
              const hx = rotHandleDist * Math.cos(angleRad);
              const hy = rotHandleDist * Math.sin(angleRad);

              return (
                <Group
                  key={token.id}
                  x={token.x}
                  y={token.y}
                  scaleX={scale}
                  scaleY={scale}
                  draggable={isDraggable}
                  onDragEnd={(e) => handleDragEnd(e, token.id)}
                  onClick={handleSelect}
                  onTap={handleSelect}
                  onPointerEnter={handleTokenHover}
                >
                  {renderVisionCone("rgba(234, 32, 39, 0.15)", token.rotation + 180)}
                  <RegularPolygon
                    sides={3}
                    radius={28 * ICON_SCALE}
                    fill="#EA2027"
                    stroke={isSelected ? "#FFF" : "#000"}
                    strokeWidth={isSelected ? 3 * ICON_SCALE : 2 * ICON_SCALE}
                    rotation={token.rotation + 180}
                  />
                  {token.label && (
                    <Text
                      text={token.label}
                      fontSize={12 * ICON_SCALE}
                      fontStyle="bold"
                      fill={token.textFill || "#FFF"}
                      x={-(token.label.length * 3.5 * ICON_SCALE)}
                      y={-10 * ICON_SCALE}
                    />
                  )}

                  {isSelected && (
                    <Group>
                      <Line points={[0, 0, hx, hy]} stroke="#3b82f6" strokeWidth={2 * ICON_SCALE} dash={[2, 2]} />
                      <Circle
                        x={hx}
                        y={hy}
                        radius={rotHandleRadius}
                        fill="#3b82f6"
                        stroke="#fff"
                        strokeWidth={2 * ICON_SCALE}
                        draggable
                        onDragStart={(e) => {
                          e.cancelBubble = true;
                        }}
                        onDragEnd={(e) => {
                          e.cancelBubble = true;
                        }}
                        onDragMove={(e) => {
                          e.cancelBubble = true;
                          const dx = e.target.x();
                          const dy = e.target.y();
                          const angle = Math.atan2(dy, dx);
                          e.target.x(rotHandleDist * Math.cos(angle));
                          e.target.y(rotHandleDist * Math.sin(angle));
                          const newRotation = (angle * 180) / Math.PI - 90;
                          setTokens((prev) =>
                            prev.map((t) => (t.id === token.id ? { ...t, rotation: newRotation } : t)),
                          );
                        }}
                      />
                    </Group>
                  )}
                </Group>
              );
            }

            if (token.type === "defender") {
              if (!showDefenders) return null;
              const angleRad = ((token.rotation - 90) * Math.PI) / 180;
              const hx = rotHandleDist * Math.cos(angleRad);
              const hy = rotHandleDist * Math.sin(angleRad);

              return (
                <Group
                  key={token.id}
                  x={token.x}
                  y={token.y}
                  scaleX={scale}
                  scaleY={scale}
                  draggable={isDraggable}
                  onDragEnd={(e) => handleDragEnd(e, token.id)}
                  onClick={handleSelect}
                  onTap={handleSelect}
                  onPointerEnter={handleTokenHover}
                >
                  {renderVisionCone("rgba(6, 82, 221, 0.15)", token.rotation)}
                  <RegularPolygon
                    sides={3}
                    radius={24 * ICON_SCALE}
                    fill="#0652DD"
                    stroke={isSelected ? "#FFF" : "#000"}
                    strokeWidth={isSelected ? 3 * ICON_SCALE : 2 * ICON_SCALE}
                    rotation={token.rotation}
                  />
                  {token.label && (
                    <Text
                      text={token.label}
                      fontSize={12 * ICON_SCALE}
                      fontStyle="bold"
                      fill={token.textFill || "#FFF"}
                      x={-(token.label.length * 3.5 * ICON_SCALE)}
                      y={0}
                    />
                  )}

                  {isSelected && (
                    <Group>
                      <Line points={[0, 0, hx, hy]} stroke="#3b82f6" strokeWidth={2 * ICON_SCALE} dash={[2, 2]} />
                      <Circle
                        x={hx}
                        y={hy}
                        radius={rotHandleRadius}
                        fill="#3b82f6"
                        stroke="#fff"
                        strokeWidth={2 * ICON_SCALE}
                        draggable
                        onDragStart={(e) => {
                          e.cancelBubble = true;
                        }}
                        onDragEnd={(e) => {
                          e.cancelBubble = true;
                        }}
                        onDragMove={(e) => {
                          e.cancelBubble = true;
                          const dx = e.target.x();
                          const dy = e.target.y();
                          const angle = Math.atan2(dy, dx);
                          e.target.x(rotHandleDist * Math.cos(angle));
                          e.target.y(rotHandleDist * Math.sin(angle));
                          const newRotation = (angle * 180) / Math.PI + 90;
                          setTokens((prev) =>
                            prev.map((t) => (t.id === token.id ? { ...t, rotation: newRotation } : t)),
                          );
                        }}
                      />
                    </Group>
                  )}
                </Group>
              );
            }

            if (token.type === "choke") {
              if (!showObjectives) return null;
              return (
                <Group
                  key={token.id}
                  x={token.x}
                  y={token.y}
                  scaleX={scale}
                  scaleY={scale}
                  draggable={isDraggable}
                  onDragEnd={(e) => handleDragEnd(e, token.id)}
                  onClick={handleSelect}
                  onTap={handleSelect}
                  onPointerEnter={handleTokenHover}
                >
                  <Circle
                    radius={28 * ICON_SCALE}
                    fill={token.color || "#FFF"}
                    stroke={isSelected ? "#3b82f6" : "#000"}
                    strokeWidth={(isSelected ? 4 : 2) * ICON_SCALE}
                  />
                  <Text
                    text={token.label || "X"}
                    fontSize={28 * ICON_SCALE}
                    fontStyle="bold"
                    fill={token.textFill || "#000"}
                    x={-(token.label?.length || 1) * 3 * ICON_SCALE - 4 * ICON_SCALE}
                    y={-11 * ICON_SCALE}
                  />
                </Group>
              );
            }

            if (token.type === "dot") {
              if (!showObjectives) return null;
              return (
                <Group
                  key={token.id}
                  x={token.x}
                  y={token.y}
                  scaleX={scale}
                  scaleY={scale}
                  draggable={isDraggable}
                  onDragEnd={(e) => handleDragEnd(e, token.id)}
                  onClick={handleSelect}
                  onTap={handleSelect}
                  onPointerEnter={handleTokenHover}
                >
                  <Circle
                    radius={24 * ICON_SCALE}
                    fill={token.color || "#FFF"}
                    stroke={isSelected ? "#3b82f6" : "#000"}
                    strokeWidth={(isSelected ? 3 : 2) * ICON_SCALE}
                  />
                  {token.label && (
                    <Text
                      text={token.label}
                      fontSize={28 * ICON_SCALE}
                      fontStyle="bold"
                      fill={token.textFill || "#000"}
                      x={-(token.label.length * 3.5 * ICON_SCALE)}
                      y={-12 * ICON_SCALE}
                    />
                  )}
                </Group>
              );
            }

            if (token.type === "square") {
              if (!showObjectives) return null;
              return (
                <Group
                  key={token.id}
                  x={token.x}
                  y={token.y}
                  scaleX={scale}
                  scaleY={scale}
                  draggable={isDraggable}
                  onDragEnd={(e) => handleDragEnd(e, token.id)}
                  onClick={handleSelect}
                  onTap={handleSelect}
                  onPointerEnter={handleTokenHover}
                >
                  <Rect
                    width={42 * ICON_SCALE}
                    height={42 * ICON_SCALE}
                    x={-8 * ICON_SCALE}
                    y={-8 * ICON_SCALE}
                    fill={token.color || "#FFF"}
                    stroke={isSelected ? "#3b82f6" : "#000"}
                    strokeWidth={(isSelected ? 3 : 2) * ICON_SCALE}
                  />
                  {token.label && (
                    <Text
                      text={token.label}
                      fontSize={28 * ICON_SCALE}
                      fontStyle="bold"
                      fill={token.textFill || "#fff"}
                      x={-(token.label.length * 3.5 * ICON_SCALE)}
                      y={-20 * ICON_SCALE}
                    />
                  )}
                </Group>
              );
            }

            if (token.type === "skull") {
              if (!showObjectives) return null;
              return (
                <Group
                  key={token.id}
                  x={token.x}
                  y={token.y}
                  scaleX={scale}
                  scaleY={scale}
                  draggable={isDraggable}
                  onDragEnd={(e) => handleDragEnd(e, token.id)}
                  onClick={handleSelect}
                  onTap={handleSelect}
                  onPointerEnter={handleTokenHover}
                >
                  <Circle
                    radius={28 * ICON_SCALE}
                    fill={token.color || "#FFF"}
                    stroke={isSelected ? "#3b82f6" : "#000"}
                    strokeWidth={(isSelected ? 3 : 2) * ICON_SCALE}
                  />
                  <Circle radius={6 * ICON_SCALE} x={-9 * ICON_SCALE} y={-6 * ICON_SCALE} fill="#000" />
                  <Circle radius={6 * ICON_SCALE} x={9 * ICON_SCALE} y={-6 * ICON_SCALE} fill="#000" />
                  <Rect width={16 * ICON_SCALE} height={7 * ICON_SCALE} x={-8 * ICON_SCALE} y={6 * ICON_SCALE} fill="#000" />
                  {token.label && (
                    <Text
                      text={token.label}
                      fontSize={28 * ICON_SCALE}
                      fontStyle="bold"
                      fill={token.textFill || "#000"}
                      x={-(token.label.length * 3.5 * ICON_SCALE)}
                      y={-28 * ICON_SCALE}
                    />
                  )}
                </Group>
              );
            }

            if (token.type === "grenade" || token.type === "smoke" || token.type === "flash" || token.type === "molotov") {
              if (!showObjectives) return null;

              let emoji = "";
              let bg = "";
              if (token.type === "grenade") {
                emoji = "💣";
                bg = "#22c55e";
              }
              if (token.type === "smoke") {
                emoji = "💨";
                bg = "#9ca3af";
              }
              if (token.type === "flash") {
                emoji = "⚡";
                bg = "#facc15";
              }
              if (token.type === "molotov") {
                emoji = "🔥";
                bg = "#f97316";
              }

              return (
                <Group
                  key={token.id}
                  x={token.x}
                  y={token.y}
                  scaleX={scale}
                  scaleY={scale}
                  draggable={isDraggable}
                  onDragEnd={(e) => handleDragEnd(e, token.id)}
                  onClick={handleSelect}
                  onTap={handleSelect}
                  onPointerEnter={handleTokenHover}
                >
                  <Circle
                    radius={28 * ICON_SCALE}
                    fill={bg}
                    stroke={isSelected ? "#3b82f6" : "#000"}
                    strokeWidth={(isSelected ? 3 : 2) * ICON_SCALE}
                    shadowColor="black"
                    shadowBlur={4 * ICON_SCALE}
                    shadowOpacity={0.5}
                    shadowOffsetY={2 * ICON_SCALE}
                  />
                  <Text text={emoji} fontSize={28 * ICON_SCALE} x={-14 * ICON_SCALE} y={-14 * ICON_SCALE} />
                  {token.label && (
                    <Text
                      text={token.label}
                      fontSize={28 * ICON_SCALE}
                      fontStyle="bold"
                      fill={token.textFill || "#000"}
                      x={-(token.label.length * 3.5 * ICON_SCALE)}
                      y={-28 * ICON_SCALE}
                    />
                  )}
                </Group>
              );
            }

            if (token.type === "sports_player") {
              if (!showObjectives) return null;
              return (
                <Group
                  key={token.id}
                  x={token.x}
                  y={token.y}
                  scaleX={scale}
                  scaleY={scale}
                  draggable={isDraggable}
                  onDragEnd={(e) => handleDragEnd(e, token.id)}
                  onClick={handleSelect}
                  onTap={handleSelect}
                  onPointerEnter={handleTokenHover}
                >
                  <Rect
                    width={42 * ICON_SCALE}
                    height={42 * ICON_SCALE}
                    x={-10 * ICON_SCALE}
                    y={-10 * ICON_SCALE}
                    fill="#dc2626"
                    stroke={isSelected ? "#3b82f6" : "#b91c1c"}
                    strokeWidth={2 * ICON_SCALE}
                    cornerRadius={4 * ICON_SCALE}
                  />
                  <Text text="B" fontSize={28 * ICON_SCALE} fontStyle="900" fill="#ffffff" x={0} y={-4 * ICON_SCALE} />
                  {token.label && (
                    <Text
                      text={token.label}
                      fontSize={28 * ICON_SCALE}
                      fontStyle="bold"
                      fill={token.textFill || "#000"}
                      x={-(token.label.length * 3.5 * ICON_SCALE)}
                      y={-26 * ICON_SCALE}
                    />
                  )}
                </Group>
              );
            }

            if (token.type === "bomb") {
              if (!showObjectives) return null;
              return (
                <Group
                  key={token.id}
                  x={token.x}
                  y={token.y}
                  scaleX={scale}
                  scaleY={scale}
                  draggable={isDraggable}
                  onDragEnd={(e) => handleDragEnd(e, token.id)}
                  onClick={handleSelect}
                  onTap={handleSelect}
                  onPointerEnter={handleTokenHover}
                >
                  <Rect
                    width={42 * ICON_SCALE}
                    height={42 * ICON_SCALE}
                    x={-9 * ICON_SCALE}
                    y={-9 * ICON_SCALE}
                    fill="#dc2626"
                    stroke={isSelected ? "#3b82f6" : "#7f1d1d"}
                    strokeWidth={2 * ICON_SCALE}
                    cornerRadius={2 * ICON_SCALE}
                  />
                  <Text text="B" fontSize={28 * ICON_SCALE} fontStyle="bold" fill="#fff" x={0} y={-4 * ICON_SCALE} />
                  {token.label && (
                    <Text
                      text={token.label}
                      fontSize={12 * ICON_SCALE}
                      fontStyle="bold"
                      fill={token.textFill || "#000"}
                      x={-(token.label.length * 3.5 * ICON_SCALE)}
                      y={-22 * ICON_SCALE}
                    />
                  )}
                </Group>
              );
            }

            return null;
          })}

          {/* map objectives markers (2x) */}
          {showMapObjectives && gameMode === "SND" && mapObjectives && setMapObjectives && mapObjectives.SND_A && mapObjectives.SND_B && (
            <Group>
              <Group
                x={MAP_WIDTH * mapObjectives.SND_A.x}
                y={MAP_HEIGHT * mapObjectives.SND_A.y}
                draggable={!isLocked && tool === "select"}
                onDragEnd={(e) => {
                  if (isLocked) return;
                  setMapObjectives({
                    ...mapObjectives,
                    SND_A: {
                      x: e.target.x() / MAP_WIDTH,
                      y: e.target.y() / MAP_HEIGHT,
                    },
                  });
                  if (onHistoryPush) onHistoryPush();
                }}
              >
                <Circle radius={25 * ICON_SCALE} fill="rgba(220, 38, 38, 0.2)" stroke="#ef4444" strokeWidth={3 * ICON_SCALE} />
                <Text text="A" fontSize={24 * ICON_SCALE} fontStyle="bold" fill="#ef4444" x={-8 * ICON_SCALE} y={-10 * ICON_SCALE} />
              </Group>
              <Group
                x={MAP_WIDTH * mapObjectives.SND_B.x}
                y={MAP_HEIGHT * mapObjectives.SND_B.y}
                draggable={!isLocked && tool === "select"}
                onDragEnd={(e) => {
                  if (isLocked) return;
                  setMapObjectives({
                    ...mapObjectives,
                    SND_B: {
                      x: e.target.x() / MAP_WIDTH,
                      y: e.target.y() / MAP_HEIGHT,
                    },
                  });
                  if (onHistoryPush) onHistoryPush();
                }}
              >
                <Circle radius={25 * ICON_SCALE} fill="rgba(220, 38, 38, 0.2)" stroke="#ef4444" strokeWidth={3 * ICON_SCALE} />
                <Text text="B" fontSize={24 * ICON_SCALE} fontStyle="bold" fill="#ef4444" x={-8 * ICON_SCALE} y={-10 * ICON_SCALE} />
              </Group>
            </Group>
          )}

          {showMapObjectives && gameMode === "HP" && mapObjectives && setMapObjectives && mapObjectives.HP_P1 && mapObjectives.HP_P2 && mapObjectives.HP_P3 && mapObjectives.HP_P4 && mapObjectives.HP_P5 && (
            <Group>
              <Group
                x={MAP_WIDTH * mapObjectives.HP_P1.x}
                y={MAP_HEIGHT * mapObjectives.HP_P1.y}
                draggable={!isLocked && tool === "select"}
                onDragEnd={(e) => {
                  if (isLocked) return;
                  setMapObjectives({
                    ...mapObjectives,
                    HP_P1: {
                      x: e.target.x() / MAP_WIDTH,
                      y: e.target.y() / MAP_HEIGHT,
                    },
                  });
                  if (onHistoryPush) onHistoryPush();
                }}
              >
                <Rect width={100 * ICON_SCALE} height={100 * ICON_SCALE} x={-50 * ICON_SCALE} y={-50 * ICON_SCALE} fill="rgba(59, 130, 246, 0.15)" stroke="#3b82f6" strokeWidth={3 * ICON_SCALE} />
                <Text text="P1" fontSize={20 * ICON_SCALE} fontStyle="bold" fill="#3b82f6" x={-11 * ICON_SCALE} y={-10 * ICON_SCALE} />
              </Group>
              <Group
                x={MAP_WIDTH * mapObjectives.HP_P2.x}
                y={MAP_HEIGHT * mapObjectives.HP_P2.y}
                draggable={!isLocked && tool === "select"}
                onDragEnd={(e) => {
                  if (isLocked) return;
                  setMapObjectives({
                    ...mapObjectives,
                    HP_P2: {
                      x: e.target.x() / MAP_WIDTH,
                      y: e.target.y() / MAP_HEIGHT,
                    },
                  });
                  if (onHistoryPush) onHistoryPush();
                }}
              >
                <Rect width={120 * ICON_SCALE} height={90 * ICON_SCALE} x={-60 * ICON_SCALE} y={-45 * ICON_SCALE} fill="rgba(234, 179, 8, 0.15)" stroke="#eab308" strokeWidth={3 * ICON_SCALE} />
                <Text text="P2" fontSize={20 * ICON_SCALE} fontStyle="bold" fill="#eab308" x={-11 * ICON_SCALE} y={-10 * ICON_SCALE} />
              </Group>
              <Group
                x={MAP_WIDTH * mapObjectives.HP_P3.x}
                y={MAP_HEIGHT * mapObjectives.HP_P3.y}
                draggable={!isLocked && tool === "select"}
                onDragEnd={(e) => {
                  if (isLocked) return;
                  setMapObjectives({
                    ...mapObjectives,
                    HP_P3: {
                      x: e.target.x() / MAP_WIDTH,
                      y: e.target.y() / MAP_HEIGHT,
                    },
                  });
                  if (onHistoryPush) onHistoryPush();
                }}
              >
                <Rect width={90 * ICON_SCALE} height={120 * ICON_SCALE} x={-45 * ICON_SCALE} y={-60 * ICON_SCALE} fill="rgba(16, 185, 129, 0.15)" stroke="#10b981" strokeWidth={3 * ICON_SCALE} />
                <Text text="P3" fontSize={20 * ICON_SCALE} fontStyle="bold" fill="#10b981" x={-11 * ICON_SCALE} y={-10 * ICON_SCALE} />
              </Group>
              {mapObjectives.HP_P4 && (
                <Group
                  x={MAP_WIDTH * mapObjectives.HP_P4.x}
                  y={MAP_HEIGHT * mapObjectives.HP_P4.y}
                  draggable={!isLocked && tool === "select"}
                  onDragEnd={(e) => {
                    if (isLocked) return;
                    setMapObjectives({
                      ...mapObjectives,
                      HP_P4: {
                        x: e.target.x() / MAP_WIDTH,
                        y: e.target.y() / MAP_HEIGHT,
                      },
                    });
                    if (onHistoryPush) onHistoryPush();
                  }}
                >
                  <Rect width={100 * ICON_SCALE} height={100 * ICON_SCALE} x={-50 * ICON_SCALE} y={-50 * ICON_SCALE} fill="rgba(236, 72, 153, 0.15)" stroke="#ec4899" strokeWidth={3 * ICON_SCALE} />
                  <Text text="P4" fontSize={20 * ICON_SCALE} fontStyle="bold" fill="#ec4899" x={-11 * ICON_SCALE} y={-10 * ICON_SCALE} />
                </Group>
              )}
              {mapObjectives.HP_P5 && (
                <Group
                  x={MAP_WIDTH * mapObjectives.HP_P5.x}
                  y={MAP_HEIGHT * mapObjectives.HP_P5.y}
                  draggable={!isLocked && tool === "select"}
                  onDragEnd={(e) => {
                    if (isLocked) return;
                    setMapObjectives({
                      ...mapObjectives,
                      HP_P5: {
                        x: e.target.x() / MAP_WIDTH,
                        y: e.target.y() / MAP_HEIGHT,
                      },
                    });
                    if (onHistoryPush) onHistoryPush();
                  }}
                >
                  <Rect width={100 * ICON_SCALE} height={100 * ICON_SCALE} x={-50 * ICON_SCALE} y={-50 * ICON_SCALE} fill="rgba(256, 1,53, 0.15)" stroke="#ec4899" strokeWidth={3 * ICON_SCALE} />
                  <Text text="P5" fontSize={20 * ICON_SCALE} fontStyle="bold" fill="#ec4899" x={-11 * ICON_SCALE} y={-10 * ICON_SCALE} />
                </Group>
              )}
            </Group>
          )}

          {showMapObjectives && gameMode === "CTL" && mapObjectives && setMapObjectives && mapObjectives.CTL_A && mapObjectives.CTL_B && (
            <Group>
              <Group
                x={MAP_WIDTH * mapObjectives.CTL_A.x}
                y={MAP_HEIGHT * mapObjectives.CTL_A.y}
                draggable={!isLocked && tool === "select"}
                onDragEnd={(e) => {
                  if (isLocked) return;
                  setMapObjectives({
                    ...mapObjectives,
                    CTL_A: {
                      x: e.target.x() / MAP_WIDTH,
                      y: e.target.y() / MAP_HEIGHT,
                    },
                  });
                  if (onHistoryPush) onHistoryPush();
                }}
              >
                <Circle radius={30 * ICON_SCALE} fill="rgba(168, 85, 247, 0.2)" stroke="#a855f7" strokeWidth={3 * ICON_SCALE} />
                <Text text="A" fontSize={24 * ICON_SCALE} fontStyle="bold" fill="#a855f7" x={-8 * ICON_SCALE} y={-10 * ICON_SCALE} />
              </Group>
              <Group
                x={MAP_WIDTH * mapObjectives.CTL_B.x}
                y={MAP_HEIGHT * mapObjectives.CTL_B.y}
                draggable={!isLocked && tool === "select"}
                onDragEnd={(e) => {
                  if (isLocked) return;
                  setMapObjectives({
                    ...mapObjectives,
                    CTL_B: {
                      x: e.target.x() / MAP_WIDTH,
                      y: e.target.y() / MAP_HEIGHT,
                    },
                  });
                  if (onHistoryPush) onHistoryPush();
                }}
              >
                <Circle radius={30 * ICON_SCALE} fill="rgba(168, 85, 247, 0.2)" stroke="#a855f7" strokeWidth={3 * ICON_SCALE} />
                <Text text="B" fontSize={24 * ICON_SCALE} fontStyle="bold" fill="#a855f7" x={-8 * ICON_SCALE} y={-10 * ICON_SCALE} />
              </Group>
            </Group>
          )}

          {showMapObjectives && gameMode === "DOM" && mapObjectives && setMapObjectives && mapObjectives.DOM_A && mapObjectives.DOM_B && mapObjectives.DOM_C && (
            <Group>
              <Group
                x={MAP_WIDTH * mapObjectives.DOM_A.x}
                y={MAP_HEIGHT * mapObjectives.DOM_A.y}
                draggable={!isLocked && tool === "select"}
                onDragEnd={(e) => {
                  if (isLocked) return;
                  setMapObjectives({
                    ...mapObjectives,
                    DOM_A: {
                      x: e.target.x() / MAP_WIDTH,
                      y: e.target.y() / MAP_HEIGHT,
                    },
                  });
                  if (onHistoryPush) onHistoryPush();
                }}
              >
                <Circle radius={25 * ICON_SCALE} fill="rgba(255, 255, 255, 0.2)" stroke="#ffffff" strokeWidth={3 * ICON_SCALE} />
                <Text text="A" fontSize={24 * ICON_SCALE} fontStyle="bold" fill="#ffffff" x={-8 * ICON_SCALE} y={-10 * ICON_SCALE} />
              </Group>
              <Group
                x={MAP_WIDTH * mapObjectives.DOM_B.x}
                y={MAP_HEIGHT * mapObjectives.DOM_B.y}
                draggable={!isLocked && tool === "select"}
                onDragEnd={(e) => {
                  if (isLocked) return;
                  setMapObjectives({
                    ...mapObjectives,
                    DOM_B: {
                      x: e.target.x() / MAP_WIDTH,
                      y: e.target.y() / MAP_HEIGHT,
                    },
                  });
                  if (onHistoryPush) onHistoryPush();
                }}
              >
                <Circle radius={25 * ICON_SCALE} fill="rgba(255, 255, 255, 0.2)" stroke="#ffffff" strokeWidth={3 * ICON_SCALE} />
                <Text text="B" fontSize={24 * ICON_SCALE} fontStyle="bold" fill="#ffffff" x={-8 * ICON_SCALE} y={-10 * ICON_SCALE} />
              </Group>
              <Group
                x={MAP_WIDTH * mapObjectives.DOM_C.x}
                y={MAP_HEIGHT * mapObjectives.DOM_C.y}
                draggable={!isLocked && tool === "select"}
                onDragEnd={(e) => {
                  if (isLocked) return;
                  setMapObjectives({
                    ...mapObjectives,
                    DOM_C: {
                      x: e.target.x() / MAP_WIDTH,
                      y: e.target.y() / MAP_HEIGHT,
                    },
                  });
                  if (onHistoryPush) onHistoryPush();
                }}
              >
                <Circle radius={25 * ICON_SCALE} fill="rgba(255, 255, 255, 0.2)" stroke="#ffffff" strokeWidth={3 * ICON_SCALE} />
                <Text text="C" fontSize={24 * ICON_SCALE} fontStyle="bold" fill="#ffffff" x={-8 * ICON_SCALE} y={-10 * ICON_SCALE} />
              </Group>
            </Group>
          )}
        </Layer>
      </Stage>

      <div className="absolute bottom-6 right-6 flex flex-col gap-2 bg-[#1a1a1a]/80 backdrop-blur-sm p-2 rounded-lg border border-white/10 z-10 shadow-lg">
        <Tooltip content="Zoom In (Ctrl + =)" side="left">
          <button
            onClick={() => {
              const scaleBy = 1.2;
              const newZoom = zoom * scaleBy;
              setZoom(newZoom);
              setPan((prev) => ({
                x: prev.x - (dimensions.width / 2 - mapX) * (scaleBy - 1),
                y: prev.y - (dimensions.height / 2 - mapY) * (scaleBy - 1),
              }));
            }}
            className="p-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded transition-colors"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
        </Tooltip>
        <Tooltip content="Reset View" side="left">
          <button
            onClick={() => {
              setZoom(1);
              setPan({ x: 0, y: 0 });
            }}
            className="p-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded transition-colors"
          >
            <Maximize className="w-5 h-5" />
          </button>
        </Tooltip>
        <Tooltip content="Zoom Out (Ctrl + -)" side="left">
          <button
            onClick={() => {
              const scaleBy = 1.2;
              const newZoom = zoom / scaleBy;
              setZoom(newZoom);
              setPan((prev) => ({
                x: prev.x - (dimensions.width / 2 - mapX) * (1 / scaleBy - 1),
                y: prev.y - (dimensions.height / 2 - mapY) * (1 / scaleBy - 1),
              }));
            }}
            className="p-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded transition-colors"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
        </Tooltip>
      </div>
    </div>
  );
}

