export interface MapObjective {
  x: number;
  y: number;
}

export interface MapSpawn extends MapObjective {
  rotation?: number;
}

export interface GameData {
  id: string;
  name: string;
}

export const gamesData: GameData[] = [
  { id: 'codm', name: 'Call of Duty Mobile' },
  { id: 'pubg_mobile', name: 'PUBG Mobile' },
  { id: 'pubg_pc', name: 'PUBG PC' },
  { id: 'warzone', name: 'Call of Duty Warzone' },
  { id: 'custom', name: 'Custom Maps' },
];

export interface MapData {
  id: string;
  gameId: string;
  name: string;
  image: string;
  teams?: string[];
  address?: string;
  supportedModes?: string[];
  objectives: {
    SND_A?: MapObjective;
    SND_B?: MapObjective;
    HP_P1?: MapObjective;
    HP_P2?: MapObjective;
    HP_P3?: MapObjective;
    HP_P4?: MapObjective;
    DOM_A?: MapObjective;
    DOM_B?: MapObjective;
    DOM_C?: MapObjective;
    CTL_A?: MapObjective;
    CTL_B?: MapObjective;
  };
  spawns?: {
    [key: string]: MapSpawn;
  };
}

export const defaultMaps: MapData[] = [
{
    id: 'tunisia',
    gameId: 'codm',
    name: 'Tunisia',
    image: '/tunisia_base_final_watermark.png-1754374489793.png',
    teams: ['Special Forces', 'Guerrilla Squad'],
    address: 'Tunisia, North Africa',
  supportedModes: ['SND'],
    objectives: {
      SND_A: { x: 0.83, y: 0.58 },
      SND_B: { x: 0.26, y: 0.72 },
    },
    spawns: {
      team1: { x: 0.45, y: 0.15, rotation: 0 },
      team2: { x: 0.65, y: 1.78, rotation: 0 },
    }
  },
  {
    id: 'crash',
    gameId: 'codm',
    name: 'Crash',
    image: 'https://callofdutymaps.com/wp-content/uploads/crashmobilecompass.png',
    teams: ['Marines', 'OpFor'],
    address: 'Basra, Iraq',
    supportedModes: ['SND', 'HP', 'DOM', 'CTL', 'TDM', 'LINEUPS'],
    objectives: {
      SND_A: { x: 0.40, y: 0.30 },
      SND_B: { x: 0.60, y: 0.70 },
      HP_P1: { x: 0.50, y: 0.50 },
      HP_P2: { x: 0.30, y: 0.25 },
      HP_P3: { x: 0.70, y: 0.80 }, HP_P4: { x: 0.65, y: 0.35 },
      DOM_A: { x: 0.30, y: 0.80 },
      DOM_B: { x: 0.50, y: 0.50 },
      DOM_C: { x: 0.70, y: 0.20 }, CTL_A: { x: 0.40, y: 0.40 }, CTL_B: { x: 0.60, y: 0.60 }
    },
    spawns: {
      team1: { x: 0.20, y: 0.50, rotation: 90 },
      team2: { x: 0.80, y: 0.50, rotation: 270 },
    }
  },
  {
    id: 'standoff',
    gameId: 'codm',
    name: 'Standoff',
    image: 'https://images.unsplash.com/photo-1628103135899-725227d825c5?auto=format&fit=crop&w=1920&q=80',
    teams: ['Mercs', 'Black Ops'],
    address: 'Kyrgyzstan',
    supportedModes: ['SND', 'HP', 'DOM', 'CTL', 'TDM', 'LINEUPS'],
    objectives: {
      SND_A: { x: 0.25, y: 0.45 },
      SND_B: { x: 0.75, y: 0.55 },
      HP_P1: { x: 0.50, y: 0.50 },
      HP_P2: { x: 0.25, y: 0.25 },
      HP_P3: { x: 0.75, y: 0.75 }, HP_P4: { x: 0.50, y: 0.80 },
      DOM_A: { x: 0.20, y: 0.50 },
      DOM_B: { x: 0.50, y: 0.50 },
      DOM_C: { x: 0.80, y: 0.50 }, CTL_A: { x: 0.30, y: 0.40 }, CTL_B: { x: 0.70, y: 0.60 }
    },
    spawns: {
      team1: { x: 0.50, y: 0.10, rotation: 180 },
      team2: { x: 0.50, y: 0.90, rotation: 0 },
    }
  },
  {
    id: 'firing_range',
    gameId: 'codm',
    name: 'Firing Range',
    image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1920&q=80',
    teams: ['Black Ops', 'CDP'],
    address: 'Cuba',
    supportedModes: ['SND', 'HP', 'DOM', 'CTL', 'TDM', 'LINEUPS'],
    objectives: {
      SND_A: { x: 0.35, y: 0.35 },
      SND_B: { x: 0.65, y: 0.65 },
      HP_P1: { x: 0.50, y: 0.50 },
      HP_P2: { x: 0.20, y: 0.70 },
      HP_P3: { x: 0.80, y: 0.30 }, HP_P4: { x: 0.70, y: 0.80 },
      DOM_A: { x: 0.25, y: 0.75 },
      DOM_B: { x: 0.50, y: 0.50 },
      DOM_C: { x: 0.75, y: 0.25 }, CTL_A: { x: 0.40, y: 0.30 }, CTL_B: { x: 0.60, y: 0.70 }
    },
    spawns: {
      team1: { x: 0.10, y: 0.50, rotation: 90 },
      team2: { x: 0.90, y: 0.50, rotation: 270 },
    }
  },
  {
    id: 'raid',
    gameId: 'codm',
    name: 'Raid',
    image: 'https://images.unsplash.com/photo-1601058268499-e52658b8ebf8?auto=format&fit=crop&w=1920&q=80',
    teams: ['FBI', 'Mercs'],
    address: 'Hollywood Hills, USA',
    supportedModes: ['SND', 'HP', 'DOM', 'CTL', 'TDM', 'LINEUPS'],
    objectives: {
      SND_A: { x: 0.20, y: 0.40 },
      SND_B: { x: 0.80, y: 0.60 },
      HP_P1: { x: 0.50, y: 0.50 },
      HP_P2: { x: 0.30, y: 0.20 },
      HP_P3: { x: 0.70, y: 0.80 }, HP_P4: { x: 0.50, y: 0.20 },
      DOM_A: { x: 0.25, y: 0.50 },
      DOM_B: { x: 0.50, y: 0.50 },
      DOM_C: { x: 0.75, y: 0.50 }, CTL_A: { x: 0.30, y: 0.30 }, CTL_B: { x: 0.70, y: 0.70 }
    },
    spawns: {
      team1: { x: 0.50, y: 0.15, rotation: 180 },
      team2: { x: 0.50, y: 0.85, rotation: 0 },
    }
  },
  {
    id: 'summit',
    gameId: 'codm',
    name: 'Summit',
    image: 'https://images.unsplash.com/photo-1551609189-eba71b3a8566?auto=format&fit=crop&w=1920&q=80',
    teams: ['Black Ops', 'Spetsnaz'],
    address: 'Ural Mountains, USSR',
    supportedModes: ['SND', 'HP', 'DOM', 'CTL', 'TDM', 'LINEUPS'],
    objectives: {
      SND_A: { x: 0.40, y: 0.20 },
      SND_B: { x: 0.60, y: 0.80 },
      HP_P1: { x: 0.50, y: 0.50 },
      HP_P2: { x: 0.20, y: 0.40 },
      HP_P3: { x: 0.80, y: 0.60 }, HP_P4: { x: 0.50, y: 0.20 },
      DOM_A: { x: 0.30, y: 0.30 },
      DOM_B: { x: 0.50, y: 0.50 },
      DOM_C: { x: 0.70, y: 0.70 }, CTL_A: { x: 0.30, y: 0.50 }, CTL_B: { x: 0.70, y: 0.50 }
    },
    spawns: {
      team1: { x: 0.15, y: 0.15, rotation: 135 },
      team2: { x: 0.85, y: 0.85, rotation: 315 },
    }
  },
  {
    id: 'killhouse',
    gameId: 'codm',
    name: 'Killhouse',
    image: 'https://images.unsplash.com/photo-1585806499879-19965d1341c2?auto=format&fit=crop&w=1920&q=80',
    teams: ['SAS', 'Spetsnaz'],
    address: 'Hereford, UK',
    supportedModes: ['TDM', 'LINEUPS'], // Killhouse usually small
    objectives: {
      SND_A: { x: 0.30, y: 0.30 },
      SND_B: { x: 0.70, y: 0.70 },
      HP_P1: { x: 0.50, y: 0.50 },
      HP_P2: { x: 0.20, y: 0.20 },
      HP_P3: { x: 0.80, y: 0.80 }, HP_P4: { x: 0.20, y: 0.80 },
      DOM_A: { x: 0.20, y: 0.50 },
      DOM_B: { x: 0.50, y: 0.50 },
      DOM_C: { x: 0.80, y: 0.50 }, CTL_A: { x: 0.50, y: 0.30 }, CTL_B: { x: 0.50, y: 0.70 }
    },
    spawns: {
      team1: { x: 0.10, y: 0.50, rotation: 90 },
      team2: { x: 0.90, y: 0.50, rotation: 270 },
    }
  }
];


export const extraMaps: MapData[] = [
  {
    id: 'erangel_mobile',
    gameId: 'pubg_mobile',
    name: 'Erangel',
    image: 'https://images.unsplash.com/photo-1542382257-80da9fc33694?auto=format&fit=crop&w=1920&q=80',
    teams: ['Team 1', 'Team 2'],
    supportedModes: ['BR', 'TDM'],
    objectives: {},
    spawns: {
      team1: { x: 0.20, y: 0.50, rotation: 90 },
      team2: { x: 0.80, y: 0.50, rotation: 270 },
    }
  },
  {
    id: 'miramar_mobile',
    gameId: 'pubg_mobile',
    name: 'Miramar',
    image: 'https://images.unsplash.com/photo-1628103135899-725227d825c5?auto=format&fit=crop&w=1920&q=80',
    teams: ['Team 1', 'Team 2'],
    supportedModes: ['BR', 'TDM'],
    objectives: {},
    spawns: {
      team1: { x: 0.20, y: 0.50, rotation: 90 },
      team2: { x: 0.80, y: 0.50, rotation: 270 },
    }
  },
  {
    id: 'erangel_pc',
    gameId: 'pubg_pc',
    name: 'Erangel',
    image: 'https://images.unsplash.com/photo-1542382257-80da9fc33694?auto=format&fit=crop&w=1920&q=80',
    teams: ['Team 1', 'Team 2'],
    supportedModes: ['BR', 'TDM'],
    objectives: {},
    spawns: {
      team1: { x: 0.20, y: 0.50, rotation: 90 },
      team2: { x: 0.80, y: 0.50, rotation: 270 },
    }
  },
  {
    id: 'verdansk',
    gameId: 'warzone',
    name: 'Verdansk',
    image: 'https://images.unsplash.com/photo-1601058268499-e52658b8ebf8?auto=format&fit=crop&w=1920&q=80',
    teams: ['Team 1', 'Team 2'],
    supportedModes: ['BR', 'Resurgence'],
    objectives: {},
    spawns: {
      team1: { x: 0.20, y: 0.50, rotation: 90 },
      team2: { x: 0.80, y: 0.50, rotation: 270 },
    }
  }
];

defaultMaps.push(...extraMaps);
