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
  { id: "codm", name: "Call of Duty Mobile" },
  { id: "pubg_mobile", name: "PUBG Mobile" },
  { id: "pubg_pc", name: "PUBG PC" },
  { id: "warzone", name: "Call of Duty Warzone" },
  { id: "custom", name: "Custom Maps" },
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
    HP_P5?: MapObjective;
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
    id: "coastal",
    gameId: "codm",
    name: "Coastal",
    image: "/maps/codm/coastal_minimap.webp",
    teams: ["Special Forces", "Guerrilla Squad"],
    address: "Coastal Region",
    supportedModes: ["SND", "LINEUPS"],
    objectives: {
      SND_A: { x: 0.64, y: 0.3 },
      SND_B: { x: 0.31, y: 0.31 },
    },

    spawns: {
      team1: {
        x: 0.83,
        y: 1.74,
        rotation: 180,
      },
      team2: {
        x: 1.1,
        y: 0.18,
        rotation: 180,
      },
    },
  },
  {
    id: "crash",
    gameId: "codm",
    name: "Crash",
    image: "/maps/codm/crash_minimap.webp",
    teams: ["Marines", "OpFor"],
    address: "Basra, Iraq",
    supportedModes: ["SND", "HP", "DOM", "LINEUPS"],
    objectives: {
      SND_A: { x: 0.41, y: 0.13 },
      SND_B: { x: 0.756, y: 0.58 },
      HP_P1: { x: 0.43, y: 0.43 },
      HP_P2: { x: 0.415, y: 0.13 },
      HP_P3: { x: 0.626, y: 0.58 },
      HP_P4: { x: 0.77, y: 0.17 },
      HP_P5: { x: 0.167, y: 0.84 },
      DOM_A: { x: 0.3, y: 0.73 },
      DOM_B: { x: 0.43, y: 0.43 },
      DOM_C: { x: 0.75, y: 0.35 },
      // CTL_A: { x: 0.4, y: 0.4 },
      // CTL_B: { x: 0.6, y: 0.6 },
    },

    spawns: {
      team1: {
        x: 0.3,
        y: 1.39,
        rotation: 270,
      },
      team2: {
        x: 1.55,
        y: 0.95,
        rotation: 270,
      },
    },
  },
  {
    id: "crossfire",
    gameId: "codm",
    name: "Crossfire",
    image: "/maps/codm/crossfire_minimap.webp",
    teams: ["Special Forces", "Guerrilla Squad"],
    address: "Middle East Desert",
    supportedModes: ["SND", "LINEUPS"],
    objectives: {
      SND_A: { x: 0.5337966134401081, y: 0.43574459596361276 },
      SND_B: { x: 0.4491070480968691, y: 0.745759893577926 },
    },
    spawns: {
      team1: { x: 0.5, y: 1, rotation: 270 },
      team2: { x: 1.4, y: 0.9, rotation: 200 },
    },
  },
  {
    id: "firing_range",
    gameId: "codm",
    name: "Firing Range",
    image: "/maps/codm/firing_range_minimap.webp",
    teams: ["Black Ops", "CDP"],
    address: "Cuba",
    supportedModes: ["SND", "HP", "DOM", "CTL", "LINEUPS"],
    objectives: {
      SND_A: { x: 0.62, y: 0.87 },
      SND_B: { x: 0.62, y: 0.23 },
      HP_P1: { x: 0.43, y: 0.43 },
      HP_P2: { x: 0.415, y: 0.13 },
      HP_P3: { x: 0.626, y: 0.58 },
      DOM_A: { x: 0.43071021274542937, y: 0.4702203620131158 },
      DOM_B: { x: 0.5493694823676977, y: 0.6235949401087129 },
      DOM_C: { x: 0.6863926865743646, y: 0.6059945786879067 },
      CTL_A: { x: 0.591747792947079, y: 0.7870268675876279 },
      CTL_B: { x: 0.62, y: 0.23 },
    },
    spawns: {
      team1: { x: 0.45, y: 1.257, rotation: 270 },
      team2: { x: 1.48, y: 0.98, rotation: 270 },
    },
  },
  {
    id: "hacienda",
    gameId: "codm",
    name: "Hacienda",
    image: "/maps/codm/hacienda_minimap.webp",
    teams: ["Special Forces", "Guerrilla Squad"],
    address: "Spain",
    supportedModes: ["SND", "LINEUPS"],
    objectives: {
      SND_A: { x: 0.83, y: 0.58 },
      SND_B: { x: 0.26, y: 0.72 },
    },
    spawns: {
      team1: { x: 0.85, y: 0.15, rotation: 0 },
      team2: { x: 0.15, y: 1.78, rotation: 0 },
    },
  },
  {
    id: "hackney_yard",
    gameId: "codm",
    name: "Hackney Yard",
    image: "/maps/codm/hackney_yard_minimap.webp",
    teams: ["Special Forces", "Guerrilla Squad"],
    address: "London, UK",
    supportedModes: ["SND", "LINEUPS"],
    objectives: {
      SND_A: { x: 0.5, y: 0.737 },
      SND_B: { x: 0.4, y: 0.2 },
    },
    spawns: {
      team1: { x: 0.4, y: 1.27, rotation: 270 },
      team2: { x: 1.45, y: 0.65, rotation: 270 },
    },
  },
  {
    id: "highrise",
    gameId: "codm",
    name: "Highrise",
    image: "/maps/codm/highrise_minimap.webp",
    teams: ["Special Forces", "Guerrilla Squad"],
    address: "New York City, USA",
    supportedModes: ["SND", "LINEUPS"],
    objectives: {
      SND_A: { x: 0.83, y: 0.58 },
      SND_B: { x: 0.26, y: 0.72 },
    },
    spawns: {
      team1: { x: 0.45, y: 0.15, rotation: 0 },
      team2: { x: 0.65, y: 1.78, rotation: 0 },
    },
  },
  {
    id: "hijacked",
    gameId: "codm",
    name: "Hijacked",
    image: "/maps/codm/hijacked_minimap.webp",
    teams: ["Special Forces", "Guerrilla Squad"],
    address: "International Waters",
    supportedModes: ["LINEUPS"],
    objectives: {},
    spawns: {
      team1: { x: 0.35, y: 0.92, rotation: 270 },
      team2: { x: 1.55, y: 0.92, rotation: 270 },
    },
  },
  {
    id: "killhouse",
    gameId: "codm",
    name: "Killhouse",
    image: "/maps/codm/killhouse_minimap.webp",
    teams: ["SAS", "Spetsnaz"],
    address: "Hereford, UK",
    supportedModes: ["LINEUPS"],
    objectives: {},
    spawns: {
      team1: { x: 0.3, y: 0.5, rotation: 270 },
      team2: { x: 1.55, y: 0.5, rotation: 270 },
    },
  },
  {
    id: "meltdown",
    gameId: "codm",
    name: "Meltdown",
    image: "/maps/codm/meltdown_minimap.webp",
    teams: ["Special Forces", "Guerrilla Squad"],
    address: "Chernobyl, Ukraine",
    supportedModes: ["SND", "LINEUPS"],
    objectives: {
      SND_A: { x: 0.505, y: 0.25 },
      SND_B: { x: 0.505, y: 0.9 },
    },
    spawns: {
      team1: { x: 0.25, y: 0.85, rotation: 270 },
      team2: { x: 1.65, y: 0.78, rotation: 270 },
    },
  },
  {
    id: "monastery",
    gameId: "codm",
    name: "Monastery",
    image: "/maps/codm/monastery_minimap.webp",
    teams: ["Special Forces", "Guerrilla Squad"],
    address: "Greece",
    supportedModes: ["LINEUPS"],
    objectives: {},
    spawns: {
      team1: { x: 0.37, y: 1.2, rotation: 270 },
      team2: { x: 1.51, y: 1.2, rotation: 270 },
    },
  },
  {
    id: "nuketown",
    gameId: "codm",
    name: "Nuketown",
    image: "/maps/codm/nuketown_minimap.webp",
    teams: ["Special Forces", "Guerrilla Squad"],
    address: "Nevada Testing Site, USA",
    supportedModes: ["HP", "LINEUPS"],
    objectives: {
      HP_P1: { x: 0.5, y: 0.23 },
      HP_P2: { x: 0.63, y: 0.55 },
      HP_P3: { x: 0.46, y: 0.52 },
      HP_P4: { x: 0.48, y: 0.7 },
    },
    spawns: {
      team1: { x: 0.32, y: 0.88, rotation: 260 },
      team2: { x: 1.5, y: 1.38, rotation: 290 },
    },
  },
  {
    id: "oasis",
    gameId: "codm",
    name: "Oasis",
    image: "/maps/codm/oasis_minimap.webp",
    teams: ["Special Forces", "Guerrilla Squad"],
    address: "Dubai, UAE",
    supportedModes: ["LINEUPS"],
    objectives: {},
    spawns: {
      team1: { x: 0.3, y: 0.75, rotation: 270 },
      team2: { x: 1.6, y: 0.75, rotation: 270 },
    },
  },
  {
    id: "raid",
    gameId: "codm",
    name: "Raid",
    image: "/maps/codm/raid_minimap.webp",
    teams: ["FBI", "Mercs"],
    address: "Hollywood Hills, USA",
    supportedModes: ["SND", "HP", "DOM", "CTL", "LINEUPS"],
    objectives: {
      SND_A: { x: 0.7, y: 0.8 },
      SND_B: { x: 0.51, y: 0.22 },
      HP_P1: { x: 0.5, y: 0.5 },
      HP_P2: { x: 0.3, y: 0.2 },
      HP_P3: { x: 0.7, y: 0.8 },
      HP_P4: { x: 0.5, y: 0.2 },
      DOM_A: { x: 0.72, y: 0.57 },
      DOM_B: { x: 0.5, y: 0.33 },
      DOM_C: { x: 0.28, y: 0.55 },
      CTL_A: { x: 0.6, y: 0.8 },
      CTL_B: { x: 0.48, y: 0.24 },
    },
    spawns: {
      team1: { x: 0.5, y: 1.45, rotation: 270 },
      team2: { x: 1.3, y: 0.6, rotation: 270 },
    },
  },
  {
    id: "rust",
    gameId: "codm",
    name: "Rust",
    image: "/maps/codm/rust_minimap.webp",
    teams: ["Special Forces", "Guerrilla Squad"],
    address: "Oil Yard, Desert",
    supportedModes: ["SND", "LINEUPS"],
    objectives: {
      SND_A: { x: 0.83, y: 0.58 },
      SND_B: { x: 0.26, y: 0.72 },
    },
    spawns: {
      team1: { x: 0.45, y: 0.15, rotation: 0 },
      team2: { x: 0.65, y: 1.78, rotation: 0 },
    },
  },
  {
    id: "shoot_house",
    gameId: "codm",
    name: "Shoot House",
    image: "/maps/codm/shoot_house_minimap.webp",
    teams: ["Special Forces", "Guerrilla Squad"],
    address: "Military Desert Training",
    supportedModes: ["SND"],
    objectives: {
      SND_A: { x: 0.83, y: 0.58 },
      SND_B: { x: 0.26, y: 0.72 },
    },
    spawns: {
      team1: { x: 0.45, y: 0.15, rotation: 0 },
      team2: { x: 0.65, y: 1.78, rotation: 0 },
    },
  },
  {
    id: "slums",
    gameId: "codm",
    name: "Slums",
    image: "/maps/codm/slums_minimap.webp",
    teams: ["Special Forces", "Guerrilla Squad"],
    address: "Panama",
    supportedModes: ["SND", "LINEUPS", "HP"],
    objectives: {
      SND_A: { x: 0.52, y: 0.18 },
      SND_B: { x: 0.6, y: 0.63 },
    },
    spawns: {
      team1: { x: 1.75, y: 0.63, rotation: 90 },
      team2: { x: 0.25, y: 1, rotation: 90 },
    },
  },
  {
    id: "standoff",
    gameId: "codm",
    name: "Standoff",
    image: "/maps/codm/standoff_minimap.webp",
    teams: ["Mercs", "Black Ops"],
    address: "Kyrgyzstan",
    supportedModes: ["SND", "HP", "DOM", "CTL", "LINEUPS"],
    objectives: {
      SND_A: { x: 0.43, y: 0.85 },
      SND_B: { x: 0.57, y: 0.58 },
      HP_P1: { x: 0.5, y: 0.5 },
      HP_P2: { x: 0.25, y: 0.25 },
      HP_P3: { x: 0.75, y: 0.75 },
      HP_P4: { x: 0.5, y: 0.5 },
      DOM_A: { x: 0.66, y: 0.85 },
      DOM_B: { x: 0.47, y: 0.65 },
      DOM_C: { x: 0.32, y: 0.37 },
      CTL_A: { x: 0.52, y: 0.52 },
      CTL_B: { x: 0.28, y: 0.68 },
    },
    spawns: {
      team1: { x: 0.45, y: 0.58, rotation: 270 },
      team2: { x: 1.5, y: 1.68, rotation: 270 },
    },
  },
  {
    id: "suldal_harbor",
    gameId: "codm",
    name: "Suldal Harbor",
    image: "/maps/codm/suldal_harbor_minimap.webp",
    teams: ["Special Forces", "Guerrilla Squad"],
    address: "Harbor Post",
    supportedModes: ["SND"],
    objectives: {
      SND_A: { x: 0.83, y: 0.58 },
      SND_B: { x: 0.26, y: 0.72 },
    },
    spawns: {
      team1: { x: 0.45, y: 0.15, rotation: 0 },
      team2: { x: 0.65, y: 1.78, rotation: 0 },
    },
  },
  {
    id: "summit",
    gameId: "codm",
    name: "Summit",
    image: "/maps/codm/summit_minimap.webp",
    teams: ["Black Ops", "Spetsnaz"],
    address: "Ural Mountains, USSR",
    supportedModes: ["SND", "HP", "DOM", "CTL", "LINEUPS"],
    objectives: {
      SND_A: { x: 0.46, y: 0.75 },
      SND_B: { x: 0.425, y: 0.265 },
      HP_P1: { x: 0.5, y: 0.5 },
      HP_P2: { x: 0.2, y: 0.4 },
      HP_P3: { x: 0.8, y: 0.6 },
      HP_P4: { x: 0.5, y: 0.2 },
      CTL_A: { x: 0.5, y: 0.5 },
      CTL_B: { x: 0.52, y: 0.16 },
    },
    spawns: {
      team1: { x: 0.3, y: 0.75, rotation: 270 },
      team2: { x: 1.7, y: 0.75, rotation: 270 },
    },
  },
  {
    id: "takeoff",
    gameId: "codm",
    name: "Takeoff",
    image: "/maps/codm/takeoff_minimap.webp",
    teams: ["Special Forces", "Guerrilla Squad"],
    address: "Maritime Launch Site",
    supportedModes: ["SND"],
    objectives: {
      SND_A: { x: 0.56, y: 0.76 },
      SND_B: { x: 0.56, y: 0.42 },
    },
    spawns: {
      team1: { x: 0.4, y: 1.2, rotation: 270 },
      team2: { x: 1.55, y: 0.95, rotation: 270 },
    },
  },
  {
    id: "terminal",
    gameId: "codm",
    name: "Terminal",
    image: "/maps/codm/terminal_minimap.webp",
    teams: ["Special Forces", "Guerrilla Squad"],
    address: "Russian Airport",
    supportedModes: ["SND"],
    objectives: {
      SND_A: { x: 0.53, y: 0.32 },
      SND_B: { x: 0.66, y: 0.64 },
      HP_P1: { x: 0.45, y: 0.6 },
    },
    spawns: {
      team1: { x: 0.35, y: 1.1, rotation: 270 },
      team2: { x: 1.27, y: 0.45, rotation: 270 },
    },
  },
  {
    id: "tunisia",
    gameId: "codm",
    name: "Tunisia",
    image: "/maps/codm/tunisia_minimap.webp",
    teams: ["Special Forces", "Guerrilla Squad"],
    address: "Tunisia, North Africa",
    supportedModes: ["SND", "LINEUPS", "HP"],
    objectives: {
      SND_A: { x: 0.46, y: 0.85 },
      SND_B: { x: 0.3, y: 0.32 },
    },
    spawns: {
      team1: { x: 1.45, y: 0.88, rotation: 90 },
      team2: { x: 0.53, y: 1.25, rotation: 90 },
    },
  },
  {
    id: "vacant",
    gameId: "codm",
    name: "Vacant",
    image: "/maps/codm/vacant_minimap.webp",
    teams: ["Special Forces", "Guerrilla Squad"],
    address: "Abandoned Office Complex",
    supportedModes: ["SND"],
    objectives: {
      SND_A: { x: 0.83, y: 0.58 },
      SND_B: { x: 0.26, y: 0.72 },
    },
    spawns: {
      team1: { x: 0.45, y: 1.1, rotation: 270 },
      team2: { x: 1.55, y: 1.2, rotation: 270 },
    },
  },
];

export const extraMaps: MapData[] = [
  {
    id: "erangel_mobile",
    gameId: "pubg_mobile",
    name: "Erangel",
    image:
      "https://images.unsplash.com/photo-1542382257-80da9fc33694?auto=format&fit=crop&w=1920&q=80",
    teams: ["Team 1", "Team 2"],
    supportedModes: ["BR", "TDM"],
    objectives: {},
    spawns: {
      team1: { x: 0.2, y: 0.5, rotation: 90 },
      team2: { x: 0.8, y: 0.5, rotation: 270 },
    },
  },
  {
    id: "miramar_mobile",
    gameId: "pubg_mobile",
    name: "Miramar",
    image:
      "https://images.unsplash.com/photo-1628103135899-725227d825c5?auto=format&fit=crop&w=1920&q=80",
    teams: ["Team 1", "Team 2"],
    supportedModes: ["BR", "TDM"],
    objectives: {},
    spawns: {
      team1: { x: 0.2, y: 0.5, rotation: 90 },
      team2: { x: 0.8, y: 0.5, rotation: 270 },
    },
  },
  {
    id: "erangel_pc",
    gameId: "pubg_pc",
    name: "Erangel",
    image:
      "https://images.unsplash.com/photo-1542382257-80da9fc33694?auto=format&fit=crop&w=1920&q=80",
    teams: ["Team 1", "Team 2"],
    supportedModes: ["BR", "TDM"],
    objectives: {},
    spawns: {
      team1: { x: 0.2, y: 0.5, rotation: 90 },
      team2: { x: 0.8, y: 0.5, rotation: 270 },
    },
  },
  {
    id: "verdansk",
    gameId: "warzone",
    name: "Verdansk",
    image:
      "https://images.unsplash.com/photo-1601058268499-e52658b8ebf8?auto=format&fit=crop&w=1920&q=80",
    teams: ["Team 1", "Team 2"],
    supportedModes: ["BR", "Resurgence"],
    objectives: {},
    spawns: {
      team1: { x: 0.2, y: 0.5, rotation: 90 },
      team2: { x: 0.8, y: 0.5, rotation: 270 },
    },
  },
];

defaultMaps.push(...extraMaps);
