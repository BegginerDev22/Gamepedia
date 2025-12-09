
import { Match, MatchStatus, Team, Tournament, TournamentTier, TransferEvent, Player, MapData, ScrimSession, VOD, TimelineEvent, Badge, Poll, Weapon, Guide, GlossaryTerm, CosmeticItem, PatchNote, MetaTier, StoreItem, RecruitmentPost, CrosshairConfig, RouletteChallenge, DeviceSpec, ReplayData, UCPack, SprayPattern, NadeLineup, RulesetPreset, Vehicle, TriviaQuestion, SensCode, Attachment, Mission, Clan } from './types';

export const MOCK_TEAMS: Record<string, Team> = {
  soul: {
    id: 'soul',
    name: 'Team Soul',
    shortName: 'Soul',
    logoUrl: 'https://ui-avatars.com/api/?name=Team+Soul&background=random',
    region: 'India',
    totalWinnings: '₹5,25,00,000',
    achievements: ['BMPS S1 Winner', 'BGIS 2023 Winner'],
    roster: [],
    transferHistory: []
  },
  godl: {
    id: 'godl',
    name: 'GodLike Esports',
    shortName: 'GodL',
    logoUrl: 'https://ui-avatars.com/api/?name=GodLike&background=random',
    region: 'India',
    totalWinnings: '₹4,50,00,000',
    achievements: ['PMGC Finalist', 'Skyesports Champ'],
    roster: [],
    transferHistory: []
  },
  tx: {
    id: 'tx',
    name: 'Team XSpark',
    shortName: 'TX',
    logoUrl: 'https://ui-avatars.com/api/?name=Team+XSpark&background=random',
    region: 'India',
    totalWinnings: '₹2,10,00,000',
    achievements: ['BGIS 2024 Winner'],
    roster: [],
    transferHistory: []
  },
  ge: {
    id: 'ge',
    name: 'Global Esports',
    shortName: 'GE',
    logoUrl: 'https://ui-avatars.com/api/?name=Global+Esports&background=random',
    region: 'India',
    totalWinnings: '₹3,00,00,000',
    achievements: ['Master Series Winner'],
    roster: [],
    transferHistory: []
  },
  blind: {
    id: 'blind',
    name: 'Blind Esports',
    shortName: 'Blind',
    logoUrl: 'https://ui-avatars.com/api/?name=Blind+Esports&background=random',
    region: 'India',
    totalWinnings: '₹1,80,00,000',
    achievements: ['Skyesports League Winner'],
    roster: [],
    transferHistory: []
  },
  entity: {
    id: 'entity',
    name: 'Entity Gaming',
    shortName: 'Entity',
    logoUrl: 'https://ui-avatars.com/api/?name=Entity+Gaming&background=random',
    region: 'India',
    totalWinnings: '₹1,50,00,000',
    achievements: ['Upthrust Series Winner'],
    roster: [],
    transferHistory: []
  }
};

export const MOCK_PLAYERS: Record<string, Player> = {
  p1: { id: 'p1', handle: 'Manya', name: 'Mohammad Raja', teamId: 'soul', role: 'IGL', image: 'https://ui-avatars.com/api/?name=Manya&background=random', stats: { matches: 45, finishes: 72, kd: 1.60, hsPercentage: '18%', avgDamage: 450, kdHistory: [1.0, 1.6] } },
  p2: { id: 'p2', handle: 'Nakul', name: 'Nakul Sharma', teamId: 'soul', role: 'Assaulter', image: 'https://ui-avatars.com/api/?name=Nakul&background=random', stats: { matches: 45, finishes: 68, kd: 1.51, hsPercentage: '19%', avgDamage: 420, kdHistory: [1.2, 1.5] } },
  p4: { id: 'p4', handle: 'Spower', name: 'Rudra B', teamId: 'soul', role: 'Entry', image: 'https://ui-avatars.com/api/?name=Spower&background=random', stats: { matches: 30, finishes: 65, kd: 2.16, hsPercentage: '25%', avgDamage: 550, kdHistory: [2.0, 2.1] } },
  p6: { id: 'p6', handle: 'Jonathan', name: 'Jonathan Amaral', teamId: 'godl', role: 'Assaulter', image: 'https://ui-avatars.com/api/?name=Jonathan&background=random', stats: { matches: 45, finishes: 88, kd: 1.95, hsPercentage: '22%', avgDamage: 510, kdHistory: [1.8, 1.95] } },
  p5: { id: 'p5', handle: 'Jelly', name: 'Jelly', teamId: 'godl', role: 'IGL', image: 'https://ui-avatars.com/api/?name=Jelly&background=random', stats: { matches: 45, finishes: 40, kd: 0.88, hsPercentage: '15%', avgDamage: 200, kdHistory: [0.8, 0.88] } },
  p9: { id: 'p9', handle: 'Shadow', name: 'Shadow', teamId: 'tx', role: 'IGL', image: 'https://ui-avatars.com/api/?name=Shadow&background=random', stats: { matches: 42, finishes: 55, kd: 1.30, hsPercentage: '20%', avgDamage: 350, kdHistory: [1.2, 1.3] } },
  p10: { id: 'p10', handle: 'NinjaJOD', name: 'Ninja', teamId: 'tx', role: 'Assaulter', image: 'https://ui-avatars.com/api/?name=NinjaJOD&background=random', stats: { matches: 42, finishes: 81, kd: 1.92, hsPercentage: '24%', avgDamage: 480, kdHistory: [1.8, 1.9] } }
};

// Populate Rosters in Teams
MOCK_TEAMS.soul.roster = [MOCK_PLAYERS.p1, MOCK_PLAYERS.p2, MOCK_PLAYERS.p4];
MOCK_TEAMS.godl.roster = [MOCK_PLAYERS.p6, MOCK_PLAYERS.p5];
MOCK_TEAMS.tx.roster = [MOCK_PLAYERS.p9, MOCK_PLAYERS.p10];

export const MOCK_MATCHES: Match[] = [
  { id: 'm1', tournamentId: 'BGIS 2024', teamA: MOCK_TEAMS.soul, teamB: MOCK_TEAMS.godl, scoreA: 18, scoreB: 12, status: MatchStatus.FINISHED, startTime: new Date().toISOString(), winnerId: 'soul', map: 'Erangel' },
  { id: 'm2', tournamentId: 'BGIS 2024', teamA: MOCK_TEAMS.tx, teamB: MOCK_TEAMS.blind, scoreA: 15, scoreB: 15, status: MatchStatus.LIVE, startTime: new Date().toISOString(), map: 'Miramar' },
  { id: 'm3', tournamentId: 'BGIS 2024', teamA: MOCK_TEAMS.ge, teamB: MOCK_TEAMS.entity, scoreA: 0, scoreB: 0, status: MatchStatus.UPCOMING, startTime: new Date(Date.now() + 86400000).toISOString(), map: 'Sanhok' }
];

export const MOCK_TOURNAMENTS: Tournament[] = [
  { id: 'bgis-2024', name: 'BGIS 2024: The Grind', organizer: 'Krafton', dates: 'Apr 4 - Apr 28, 2024', prizePool: '₹2,00,00,000', location: 'Online', tier: TournamentTier.A, teamsCount: 256, bannerUrl: 'https://picsum.photos/1200/400?random=1', logoUrl: 'https://ui-avatars.com/api/?name=BGIS&background=random' },
  { id: 'bmps-2024', name: 'BMPS 2024 Season 1', organizer: 'Krafton', dates: 'May 15 - Jun 10, 2024', prizePool: '₹1,00,00,000', location: 'LAN - Mumbai', tier: TournamentTier.S, teamsCount: 96, bannerUrl: 'https://picsum.photos/1200/400?random=2', logoUrl: 'https://ui-avatars.com/api/?name=BMPS&background=random' }
];

export const RECENT_TRANSFERS: TransferEvent[] = [
  { date: '2024-04-12', player: 'Spower', action: 'Joined', fromTo: 'Team Soul' },
  { date: '2024-04-10', player: 'NinjaJOD', action: 'Joined', fromTo: 'Team XSpark' },
  { date: '2024-04-08', player: 'Scout', action: 'Left', fromTo: 'Team XSpark' }
];

export const MOCK_MAPS: Record<string, MapData> = {
  erangel: { id: 'erangel', name: 'Erangel', imageUrl: 'https://raw.githubusercontent.com/pubg/api-assets/master/Assets/Maps/Erangel_Main_Low_Res.png', points: [
      { id: 'p1', x: 50, y: 50, name: 'Pochinki', type: 'loot', description: 'High tier loot, very crowded.' },
      { id: 'p2', x: 65, y: 35, name: 'Yasnaya Polyana', type: 'drop', teamId: 'soul', description: 'Team Soul home drop.' },
      { id: 'p3', x: 30, y: 40, name: 'Georgepol', type: 'drop', teamId: 'godl', description: 'GodLike home drop.' }
  ]},
  miramar: { id: 'miramar', name: 'Miramar', imageUrl: 'https://raw.githubusercontent.com/pubg/api-assets/master/Assets/Maps/Miramar_Main_Low_Res.png', points: [] },
  sanhok: { id: 'sanhok', name: 'Sanhok', imageUrl: 'https://raw.githubusercontent.com/pubg/api-assets/master/Assets/Maps/Sanhok_Main_Low_Res.png', points: [] },
  vikendi: { id: 'vikendi', name: 'Vikendi', imageUrl: 'https://raw.githubusercontent.com/pubg/api-assets/master/Assets/Maps/Vikendi_Main_Low_Res.png', points: [] }
};

export const MOCK_SCRIM_SESSIONS: ScrimSession[] = [
  {
      id: 's1',
      title: 'Upthrust Esports T1 Scrims',
      date: '2024-04-15',
      organizer: 'Upthrust',
      tier: 'T1',
      results: [
          { rank: 1, teamId: 'soul', teamName: 'Team Soul', matches: 5, wwcd: 2, finishPts: 30, totalPts: 65 },
          { rank: 2, teamId: 'godl', teamName: 'GodLike', matches: 5, wwcd: 1, finishPts: 35, totalPts: 55 },
          { rank: 3, teamId: 'tx', teamName: 'Team XSpark', matches: 5, wwcd: 0, finishPts: 25, totalPts: 40 }
      ]
  }
];

export const MOCK_VODS: VOD[] = [
  { id: 'v1', title: 'BGIS The Grind Day 3 Highlights', thumbnailUrl: 'https://picsum.photos/800/450?random=10', videoUrl: '#', duration: '12:34', views: '1.2M', uploadDate: '2 days ago', tags: ['Highlight', 'Full Match'] },
  { id: 'v2', title: 'Jonathan 1v4 Clutch vs Soul', thumbnailUrl: 'https://picsum.photos/800/450?random=11', videoUrl: '#', duration: '2:10', views: '500K', uploadDate: '1 week ago', tags: ['Clutch', 'Highlight'], featured: true }
];

export const MOCK_TIMELINE_EVENTS: TimelineEvent[] = [
  { id: 'e1', date: 'July 2021', title: 'BGMI Launch', description: 'Battlegrounds Mobile India officially launches on Android.', type: 'Milestone', imageUrl: 'https://picsum.photos/400/200?random=20' },
  { id: 'e2', date: 'Sept 2021', title: 'BGIS 2021 Announced', description: 'First official tournament with 1Cr prize pool.', type: 'Tournament' }
];

export const MOCK_WEAPONS: Weapon[] = [
  { id: 'w1', name: 'M416', type: 'AR', damage: 41, fireRate: 75, range: 60, recoil: 20, ammoType: '5.56mm', tier: 'S', image: 'https://raw.githubusercontent.com/pubg/api-assets/master/Assets/Icons/Weapon/Main/HK416.png' },
  { id: 'w2', name: 'AKM', type: 'AR', damage: 47, fireRate: 60, range: 50, recoil: 45, ammoType: '7.62mm', tier: 'A', image: 'https://raw.githubusercontent.com/pubg/api-assets/master/Assets/Icons/Weapon/Main/AK47.png' },
  { id: 'w3', name: 'AWM', type: 'SR', damage: 105, fireRate: 5, range: 100, recoil: 60, ammoType: '.300 Mag', tier: 'S', image: 'https://raw.githubusercontent.com/pubg/api-assets/master/Assets/Icons/Weapon/Main/AWM.png' },
  { id: 'w4', name: 'UMP45', type: 'SMG', damage: 41, fireRate: 70, range: 30, recoil: 15, ammoType: '.45 ACP', tier: 'A', image: 'https://raw.githubusercontent.com/pubg/api-assets/master/Assets/Icons/Weapon/Main/UMP.png' }
];

export const MOCK_GUIDES: Guide[] = [
  { id: 'g1', title: 'Mastering the 3-1 Split', author: 'Mortal', role: 'IGL', category: 'Macro', difficulty: 'Advanced', readTime: '5 min', likes: 1200, imageUrl: 'https://picsum.photos/400/200?random=30', content: 'Detailed guide on splitting formation...' },
  { id: 'g2', title: 'Spray Control 101', author: 'Jonathan', role: 'Assaulter', category: 'Mechanics', difficulty: 'Beginner', readTime: '3 min', likes: 3500, imageUrl: 'https://picsum.photos/400/200?random=31', content: 'How to pull down your crosshair effectively.' }
];

export const MOCK_GLOSSARY: GlossaryTerm[] = [
  { id: 't1', term: 'IGL', definition: 'In-Game Leader. The player who makes rotation and strategy calls.', category: 'General' },
  { id: 't2', term: 'Rotation', definition: 'Moving from one position to another, usually into the safe zone.', category: 'Macro' },
  { id: 't3', term: 'Gatekeep', definition: 'Holding the edge of the zone to prevent other teams from entering.', category: 'Strategy' }
];

export const MOCK_COSMETICS: CosmeticItem[] = [
  { id: 'c1', name: 'Pharaoh X-Suit', type: 'X-Suit', rarity: 'Mythic', image: 'https://picsum.photos/200/200?random=40', maxLevel: 6, releaseDate: '2020', priceEstimates: '80k UC' },
  { id: 'c2', name: 'Glacier M416', type: 'Gun Lab', rarity: 'Legendary', image: 'https://picsum.photos/200/200?random=41', maxLevel: 7, releaseDate: '2019', priceEstimates: '50k UC' }
];

export const MOCK_STORE_ITEMS: StoreItem[] = [
  { id: 'si1', name: 'Conqueror Frame S1', type: 'Frame', rarity: 'Legendary', price: 5000, image: 'https://picsum.photos/100/100?random=60', description: 'Frame for reaching Conqueror in Season 1.' },
  { id: 'si2', name: 'Gamepedia Pro Avatar', type: 'Avatar', rarity: 'Epic', price: 1500, image: 'https://picsum.photos/100/100?random=61', description: 'Exclusive avatar for pro members.' }
];

export const MOCK_POLL: Poll = {
  id: 'poll1',
  question: "Which map should be removed from competitive rotation?",
  totalVotes: 15420,
  status: 'Active',
  options: [
      { id: 'o1', label: 'Vikendi', votes: 6500 },
      { id: 'o2', label: 'Sanhok', votes: 4200 },
      { id: 'o3', label: 'Miramar', votes: 3000 },
      { id: 'o4', label: 'Keep All', votes: 1720 }
  ]
};

export const MOCK_BADGES: Badge[] = [
  { id: 'b1', name: 'First Win', description: 'Win your first prediction', icon: '🏆', unlocked: true, rarity: 'Common' },
  { id: 'b2', name: 'High Roller', description: 'Win 1000+ points in one bet', icon: '💎', unlocked: false, rarity: 'Epic' },
  { id: 'b3', name: 'Analyst', description: 'Read 10 guides', icon: '📚', unlocked: false, rarity: 'Rare' }
];

export const MOCK_PATCH_NOTES: PatchNote[] = [
  {
      id: 'p1', version: 'v3.2', date: 'April 10, 2024', title: 'Mecha Fusion Update', description: 'Added Mecha vehicles and P90 to airdrops.', impactRating: 'High',
      changes: [
          { item: 'P90', type: 'New', details: 'Added to Air Drops. Uses 5.7mm ammo.' },
          { item: 'DBS', type: 'Nerf', details: 'Damage range reduced by 15%.' }
      ]
  }
];

export const MOCK_META_TIER_LIST: MetaTier[] = [
  { tier: 'S', items: ['M416', 'UMP45', 'P90', 'DBS'] },
  { tier: 'A', items: ['AKM', 'SCAR-L', 'AWM', 'M24'] },
  { tier: 'B', items: ['Vector', 'Kar98k', 'DP-28'] },
  { tier: 'C', items: ['Pistols', 'Crossbow', 'Shotguns (others)'] }
];

export const MOCK_RECRUITMENT: RecruitmentPost[] = [
  { id: 'r1', type: 'LFP', author: 'Team 8Bit', image: 'https://ui-avatars.com/api/?name=8Bit&background=random', roles: ['IGL', 'Assaulter'], tier: 'T1', requirements: 'Min 3 KD, T1 experience required.', postedDate: '2h ago', status: 'Open' },
  { id: 'r2', type: 'LFT', author: 'RisingStar', image: 'https://ui-avatars.com/api/?name=RS&background=random', roles: ['Support'], tier: 'T2', requirements: 'Looking for serious grind.', postedDate: '5h ago', status: 'Open' }
];

export const PRO_CROSSHAIRS: Record<string, CrosshairConfig> = {
  'jonathan': { color: '#00FF00', length: 12, thickness: 2, gap: 0, outline: true, dot: false },
  'scout': { color: '#FFFFFF', length: 10, thickness: 2, gap: 0, outline: true, dot: false },
  'mortal': { color: '#FFFF00', length: 14, thickness: 3, gap: 2, outline: true, dot: true }
};

export const ROULETTE_CHALLENGES: RouletteChallenge[] = [
  { id: 'rc1', title: 'Pistols Only', description: 'Win the match using only pistols.', difficulty: 'Hard' },
  { id: 'rc2', title: 'No Helmets', description: 'Do not pick up any helmets.', difficulty: 'Medium' }
];

export const MOCK_REPLAY_DATA: ReplayData = {
  matchId: 'm1',
  mapUrl: 'https://raw.githubusercontent.com/pubg/api-assets/master/Assets/Maps/Erangel_Main_Low_Res.png',
  duration: 1800,
  teams: [
      { teamId: 'soul', color: '#0000FF', path: [{x: 65, y: 35}, {x: 60, y: 40}, {x: 50, y: 50}] },
      { teamId: 'godl', color: '#FFFF00', path: [{x: 30, y: 40}, {x: 40, y: 45}, {x: 48, y: 48}] }
  ],
  zoneStates: [
      { time: 0, x: 50, y: 50, radius: 40 },
      { time: 300, x: 55, y: 45, radius: 25 },
      { time: 600, x: 52, y: 48, radius: 15 }
  ]
};

export const MOCK_DEVICES: DeviceSpec[] = [
  { id: 'd1', model: 'iPhone 15 Pro Max', brand: 'Apple', processor: 'A17 Pro', maxFps: '90 FPS', gyro: 'Hardware', battery: '4422 mAh', releaseYear: '2023', image: 'https://picsum.photos/100/150?random=70' },
  { id: 'd2', model: 'ROG Phone 8', brand: 'ASUS', processor: 'Snapdragon 8 Gen 3', maxFps: '90 FPS', gyro: 'Hardware', battery: '5500 mAh', releaseYear: '2024', image: 'https://picsum.photos/100/150?random=71' }
];

export const RANK_THRESHOLDS = [
  { name: 'Bronze', points: 1200 },
  { name: 'Silver', points: 1700 },
  { name: 'Gold', points: 2200 },
  { name: 'Platinum', points: 2700 },
  { name: 'Diamond', points: 3200 },
  { name: 'Crown', points: 3700 },
  { name: 'Ace', points: 4200 },
  { name: 'Ace Master', points: 4700 },
  { name: 'Ace Dominator', points: 5200 },
  { name: 'Conqueror', points: 6000 } // Approx top 500
];

export const SENSITIVITY_CONVERSION: Record<string, number> = {
  'codm': 2.5,
  'freefire': 1.8,
  'newstate': 1.0,
  'apex': 3.0,
  'pubgpc': 5.0
};

export const SPRAY_PATTERNS: Record<string, SprayPattern> = {
  'M416': { weaponId: 'w1', difficulty: 'Easy', verticalRecoil: 2, horizontalJitter: 2, bullets: 40 },
  'AKM': { weaponId: 'w2', difficulty: 'Hard', verticalRecoil: 4, horizontalJitter: 5, bullets: 40 },
  'Beryl M762': { weaponId: 'w3', difficulty: 'Hard', verticalRecoil: 4.5, horizontalJitter: 4, bullets: 40 }
};

export const UC_PACKS: UCPack[] = [
  { amount: 60, bonus: 0, priceInr: 75 },
  { amount: 300, bonus: 25, priceInr: 380 },
  { amount: 600, bonus: 60, priceInr: 750 },
  { amount: 1500, bonus: 300, priceInr: 1900 },
  { amount: 3000, bonus: 850, priceInr: 3800 },
  { amount: 6000, bonus: 2100, priceInr: 7500 }
];

export const MOCK_NADE_LINEUPS: NadeLineup[] = [
  { id: 'nl1', title: 'Apartment Top Floor Frag', map: 'Erangel', location: 'School Apartments', type: 'Frag', difficulty: 'Medium', standImage: 'https://picsum.photos/400/300?random=80', aimImage: 'https://picsum.photos/400/300?random=81', description: 'Stand at the broken wall, aim at the cloud tip, jump throw.' },
  { id: 'nl2', title: 'Main Building Smoke Wall', map: 'Miramar', location: 'Pecado', type: 'Smoke', difficulty: 'Easy', standImage: 'https://picsum.photos/400/300?random=82', aimImage: 'https://picsum.photos/400/300?random=83', description: 'Block vision from casino.' }
];

export const RULESET_PRESETS: RulesetPreset[] = [
  { id: 'bgis', name: 'BGIS Official', description: 'Standard Krafton ruleset.', points: '10 Pt', maps: ['Erangel', 'Miramar', 'Sanhok', 'Vikendi'], bans: ['Flare Gun', 'Shop Tokens'] },
  { id: 'classic', name: 'Classic Scrims', description: 'Old school 15 points system.', points: '15 Pt', maps: ['Erangel', 'Miramar'], bans: [] }
];

export const MOCK_VEHICLES: Vehicle[] = [
    {
        id: 'v1',
        name: 'UAZ (Closed Top)',
        type: 'Land',
        seats: 4,
        maxSpeed: 115,
        health: 1800,
        description: 'The most reliable squad vehicle. Provides excellent cover but consumes fuel quickly.',
        image: 'https://raw.githubusercontent.com/pubg/api-assets/master/Assets/Icons/Vehicle/Land/T_Vehicle_UAZ_C.png'
    },
    {
        id: 'v2',
        name: 'Dacia',
        type: 'Land',
        seats: 4,
        maxSpeed: 130,
        health: 1500,
        description: 'Faster than the UAZ but has less health. Great for road rotations on Erangel.',
        image: 'https://raw.githubusercontent.com/pubg/api-assets/master/Assets/Icons/Vehicle/Land/T_Vehicle_Dacia_C.png'
    },
    {
        id: 'v3',
        name: 'Coupe RB',
        type: 'Land',
        seats: 2,
        maxSpeed: 150,
        health: 1000,
        description: 'The fastest car on land. Perfect for scouting or duo rotations.',
        image: 'https://raw.githubusercontent.com/pubg/api-assets/master/Assets/Icons/Vehicle/Land/T_Vehicle_CoupeRB_C.png'
    },
    {
        id: 'v4',
        name: 'Buggy',
        type: 'Land',
        seats: 2,
        maxSpeed: 100,
        health: 900,
        description: 'Excellent off-road capabilities but leaves the passenger very exposed.',
        image: 'https://raw.githubusercontent.com/pubg/api-assets/master/Assets/Icons/Vehicle/Land/T_Vehicle_Buggy_C.png'
    },
    {
        id: 'v5',
        name: 'Motorcycle',
        type: 'Land',
        seats: 2,
        maxSpeed: 140,
        health: 600,
        description: 'High speed and agility, but high risk of crashing. Hardest hitbox to shoot.',
        image: 'https://raw.githubusercontent.com/pubg/api-assets/master/Assets/Icons/Vehicle/Land/T_Vehicle_Motorcycle_C.png'
    },
    {
        id: 'v6',
        name: 'PG-117',
        type: 'Water',
        seats: 5,
        maxSpeed: 90,
        health: 1500,
        description: 'Standard boat. Good for coastal rotations but very loud.',
        image: 'https://raw.githubusercontent.com/pubg/api-assets/master/Assets/Icons/Vehicle/Water/T_Vehicle_PG117_C.png'
    },
    {
        id: 'v7',
        name: 'Motor Glider',
        type: 'Air',
        seats: 2,
        maxSpeed: 70,
        health: 800,
        description: 'Only air vehicle. Uses a lot of fuel. Passenger can shoot.',
        image: 'https://raw.githubusercontent.com/pubg/api-assets/master/Assets/Icons/Vehicle/Air/T_Vehicle_MotorGlider_C.png'
    },
    {
        id: 'v8',
        name: 'BRDM-2',
        type: 'Land',
        seats: 4,
        maxSpeed: 80,
        health: 2500,
        description: 'Amphibious tank called in by Flare Gun. Bulletproof tires and high HP.',
        image: 'https://raw.githubusercontent.com/pubg/api-assets/master/Assets/Icons/Vehicle/Land/T_Vehicle_BRDM_C.png'
    }
];

export const MOCK_TRIVIA: TriviaQuestion[] = [
    {
        id: 'q1',
        question: "Which weapon uses 5.56mm ammo and has the highest fire rate among ARs?",
        options: ["M416", "SCAR-L", "M16A4", "FAMAS"],
        correctAnswer: 3,
        points: 100,
        explanation: "The FAMAS has the highest fire rate of all Assault Rifles but is limited to Livik and Erangel (drop/event)."
    },
    {
        id: 'q2',
        question: "What is the name of the Tier 3 helmet in BGMI?",
        options: ["Special Forces Helmet", "Spetsnaz Helmet", "Tactical Helmet", "Military Helmet"],
        correctAnswer: 1,
        points: 100,
        explanation: "The Level 3 helmet is officially called the 'Spetsnaz Helmet' based on Russian special forces gear."
    },
    {
        id: 'q3',
        question: "Which team won the inaugural BGIS tournament in 2021?",
        options: ["Team Soul", "GodLike Esports", "Skylightz Gaming", "TSM Entity"],
        correctAnswer: 2,
        points: 200,
        explanation: "Skylightz Gaming won the first-ever BGIS in 2021, with TSM placing second."
    },
    {
        id: 'q4',
        question: "How much damage does a Kar98k headshot do to a Level 2 Helmet?",
        options: ["98", "100", "88", "92"],
        correctAnswer: 3,
        points: 150,
        explanation: "A Kar98k deals roughly 92 damage to a Level 2 helmet, leaving the target with very low HP but not knocking them immediately."
    },
    {
        id: 'q5',
        question: "Which map is the smallest in standard matchmaking?",
        options: ["Sanhok", "Livik", "Karakin", "Nusa"],
        correctAnswer: 3,
        points: 100,
        explanation: "Nusa is the smallest map at 1x1 km, followed by Karakin and Livik (2x2 km)."
    }
];

export const MOCK_SENS_CODES: SensCode[] = [
    {
        id: 'sc1',
        player: 'Jonathan',
        code: '6983-2423-5232-1122',
        type: 'Gyro',
        layout: '2 Finger',
        device: 'Mobile',
        likes: 15420,
        lastUpdated: '2 days ago'
    },
    {
        id: 'sc2',
        player: 'Mortal',
        code: '7012-1144-9988-2211',
        type: 'Gyro',
        layout: '4 Finger',
        device: 'Mobile',
        likes: 8900,
        lastUpdated: '1 week ago'
    },
    {
        id: 'sc3',
        player: 'Scout',
        code: '5566-7788-9900-1122',
        type: 'Gyro',
        layout: '4 Finger',
        device: 'Mobile',
        likes: 11200,
        lastUpdated: '3 days ago'
    },
    {
        id: 'sc4',
        player: 'iPad Player (Custom)',
        code: '1122-3344-5566-7788',
        type: 'Non-Gyro',
        layout: '5 Finger',
        device: 'Tablet',
        likes: 2300,
        lastUpdated: '1 month ago'
    },
    {
        id: 'sc5',
        player: 'Entry Fragger Aggro',
        code: '9988-7766-5544-3322',
        type: 'Gyro',
        layout: '3 Finger',
        device: 'Mobile',
        likes: 450,
        lastUpdated: 'Today'
    }
];

export const MOCK_POLLS_ARCHIVE: Poll[] = [
    { ...MOCK_POLL, id: 'poll_archive_1', status: 'Closed', endDate: '2024-04-01' },
    { ...MOCK_POLL, id: 'poll_archive_2', question: 'Best AR?', status: 'Closed', endDate: '2024-03-15' }
];

export const MOCK_ATTACHMENTS: Attachment[] = [
    {
        id: 'a1',
        name: 'Vertical Foregrip',
        type: 'Grip',
        stats: { recoilVert: -20, recoilHoriz: 0, stability: 10 },
        description: 'Significantly reduces vertical recoil. Best for spraying with M416 or Beryl.',
        image: 'https://raw.githubusercontent.com/pubg/api-assets/master/Assets/Icons/Item/Attach/Weapon/Lower/Item_Attach_Weapon_Lower_Foregrip_Vertical_C.png'
    },
    {
        id: 'a2',
        name: 'Angled Foregrip',
        type: 'Grip',
        stats: { recoilVert: 0, recoilHoriz: -20, adsSpeed: 10 },
        description: 'Reduces horizontal recoil and increases ADS speed. Good for DMRs and close range sprays.',
        image: 'https://raw.githubusercontent.com/pubg/api-assets/master/Assets/Icons/Item/Attach/Weapon/Lower/Item_Attach_Weapon_Lower_Foregrip_Angled_C.png'
    },
    {
        id: 'a3',
        name: 'Half Grip',
        type: 'Grip',
        stats: { recoilVert: -10, recoilHoriz: -10, stability: -10 },
        description: 'Balanced recoil reduction but decreases weapon stability. Popular for experienced sprayers.',
        image: 'https://raw.githubusercontent.com/pubg/api-assets/master/Assets/Icons/Item/Attach/Weapon/Lower/Item_Attach_Weapon_Lower_Foregrip_Half_C.png'
    },
    {
        id: 'a4',
        name: 'Compensator (AR)',
        type: 'Muzzle',
        stats: { recoilVert: -15, recoilHoriz: -10 },
        description: 'Best attachment for raw recoil control. Does not hide flash.',
        image: 'https://raw.githubusercontent.com/pubg/api-assets/master/Assets/Icons/Item/Attach/Weapon/Muzzle/Item_Attach_Weapon_Muzzle_Compensator_Large_C.png'
    },
    {
        id: 'a5',
        name: 'Suppressor (AR)',
        type: 'Muzzle',
        stats: { stability: 5 },
        description: 'Silences shots and hides muzzle flash. Minimal recoil benefit.',
        image: 'https://raw.githubusercontent.com/pubg/api-assets/master/Assets/Icons/Item/Attach/Weapon/Muzzle/Item_Attach_Weapon_Muzzle_Suppressor_Large_C.png'
    },
    {
        id: 'a6',
        name: 'Extended Mag (AR)',
        type: 'Magazine',
        stats: { capacity: 10 },
        description: 'Increases magazine capacity by 10 rounds. Essential for squad wipes.',
        image: 'https://raw.githubusercontent.com/pubg/api-assets/master/Assets/Icons/Item/Attach/Weapon/Magazine/Item_Attach_Weapon_Magazine_Extended_Large_C.png'
    }
];

export const MOCK_MISSIONS: Mission[] = [
    {
        id: 'm1',
        title: 'Daily Reader',
        description: 'Read 3 News Articles to stay updated.',
        reward: 50,
        type: 'Daily',
        progress: 1,
        maxProgress: 3,
        completed: false,
        claimed: false,
        icon: 'Read'
    },
    {
        id: 'm2',
        title: 'Tactical Mind',
        description: 'Create and save a strategy on the Strategy Board.',
        reward: 100,
        type: 'Daily',
        progress: 0,
        maxProgress: 1,
        completed: false,
        claimed: false,
        icon: 'Create'
    },
    {
        id: 'm3',
        title: 'Vote Caster',
        description: 'Participate in the daily poll.',
        reward: 25,
        type: 'Daily',
        progress: 1,
        maxProgress: 1,
        completed: true,
        claimed: false,
        icon: 'Vote'
    },
    {
        id: 'w1',
        title: 'Weekly Grinder',
        description: 'Win 5 Fantasy predictions correctly.',
        reward: 500,
        type: 'Weekly',
        progress: 2,
        maxProgress: 5,
        completed: false,
        claimed: false,
        icon: 'Win'
    }
];

export const MOCK_CLAN: Clan = {
    id: 'clan1',
    name: 'Ghost Elite',
    level: 7,
    motto: 'Strike from the shadows.',
    logo: 'https://ui-avatars.com/api/?name=Ghost+Elite&background=1e293b&color=fff',
    notice: 'Scrims daily at 8 PM. Join Discord voice channel 10 mins early. Inactives will be kicked every Sunday.',
    members: [
        { id: 'cm1', name: 'Ghost_Leader', role: 'Leader', contribution: 12500, lastActive: 'Online', avatar: 'https://ui-avatars.com/api/?name=GL' },
        { id: 'cm2', name: 'Sniper_Viper', role: 'Co-Leader', contribution: 8900, lastActive: '2h ago', avatar: 'https://ui-avatars.com/api/?name=SV' },
        { id: 'cm3', name: 'Rush_B', role: 'Elite', contribution: 6500, lastActive: '5h ago', avatar: 'https://ui-avatars.com/api/?name=RB' },
        { id: 'cm4', name: 'Camper_OP', role: 'Member', contribution: 3200, lastActive: '1d ago', avatar: 'https://ui-avatars.com/api/?name=CO' },
        { id: 'cm5', name: 'Newbie_1', role: 'Member', contribution: 500, lastActive: 'Online', avatar: 'https://ui-avatars.com/api/?name=N1' }
    ],
    requests: [
        { id: 'req1', name: 'Tryhard_User', kd: 4.2, date: '2024-04-20' },
        { id: 'req2', name: 'Casual_Gamer', kd: 1.8, date: '2024-04-21' }
    ]
};
