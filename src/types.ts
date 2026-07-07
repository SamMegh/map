export type ToolType = 'select' | 'pen' | 'eraser' | 'arrow' | 'polygon' | 'square' | 'circle' | 'text' | 'image' | 'mic' | 'ruler';

export type TokenType = 'attacker' | 'defender' | 'choke' | 'skull' | 'dot' | 'square' | 'sports_player' | 'bomb_a' | 'bomb_b' | 'bomb' | 'grenade' | 'smoke' | 'flash' | 'molotov';

export interface Point {
  x: number;
  y: number;
}

export interface LineData {
  id: string;
  tool: ToolType;
  points: number[];
  color: string;
  text?: string;
  url?: string;
  attachedTokenId?: string;
}

export interface TokenData {
  id: string;
  type: TokenType;
  x: number;
  y: number;
  rotation: number;
  color?: string;
  label?: string;
  fov?: number;
  visionLength?: number;
  scale?: number;
  showCone?: boolean;
  visionOpacity?: number;
  textFill?: string;
  mediaUrl?: string;
}

export interface MapObjectives {
  [key: string]: { x: number, y: number };
}
