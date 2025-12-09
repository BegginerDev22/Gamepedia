
import React from 'react';

export enum MatchStatus {
  UPCOMING = 'Upcoming',
  LIVE = 'Live',
  FINISHED = 'Finished'
}

export enum TournamentTier {
  S = 'S-Tier',
  A = 'A-Tier',
  B = 'B-Tier',
  C = 'C-Tier'
}

export interface PlayerStatHistory {
    matchId: string;
    tournament: string;
    finishes: number;
    damage: number;
    date: string;
}

export interface PlayerSettings {
    device: string;
    controlsCode: string;
    graphics: string;
    sensitivity: {
        camera: { noScope: number; redDot: number; x3: number; x4: number };
        ads: { noScope: number; redDot: number; x3: number; x4: number };
        gyro: { noScope: number; redDot: number; x3: number; x4: number };
    };
}

export interface Player {
  id: string;
  handle: string;
  name: string;
  teamId?: string;
  role: string; // e.g. 'IGL', 'Assault', 'Support'
  image?: string;
  bio?: string;
  socials?: {
      twitter?: string;
      instagram?: string;
      youtube?: string;
  };
  stats?: {
      matches: number;
      finishes: number;
      kd: number;
      hsPercentage: string;
      avgDamage: number;
      kdHistory: number[];
  };
  matchHistory?: PlayerStatHistory[];
  settings?: PlayerSettings;
}

export interface TransferEvent {
    date: string;
    player: string;
    action: 'Joined' | 'Left' | 'Benched';
    fromTo?: string;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  logoUrl: string;
  region: string;
  totalWinnings?: string;
  achievements?: string[];
  roster?: Player[];
  transferHistory?: TransferEvent[];
}

export interface Match {
  id: string;
  tournamentId: string;
  teamA: Team;
  teamB: Team;
  scoreA: number;
  scoreB: number;
  status: MatchStatus;
  startTime: string;
  map?: string;
  winnerId?: string;
}

export interface Tournament {
  id: string;
  name: string;
  organizer: string;
  dates: string;
  prizePool: string;
  location: string;
  tier: TournamentTier;
  teamsCount: number;
  winnerId?: string;
  bannerUrl: string;
  logoUrl: string;
}

export interface NavItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
}

export interface ChatMessage {
  id: string;
  user: string;
  text: string;
  timestamp: string;
  isSystem?: boolean;
  teamSupport?: string; // 'teamA' | 'teamB'
}

export interface FantasyPlayer extends Player {
  cost: number;
  selected?: boolean;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  category: 'Transfer' | 'Tournament' | 'Match' | 'Interview';
  timestamp: string;
  imageUrl: string;
  generatedContent?: string; // For AI content
}

export interface MapPOI {
    id: string;
    x: number; // percentage 0-100
    y: number; // percentage 0-100
    name: string;
    type: 'drop' | 'loot' | 'vehicle';
    teamId?: string;
    description?: string;
}

export interface MapData {
    id: string;
    name: string;
    imageUrl: string;
    points: MapPOI[];
}

export interface ScrimResult {
    rank: number;
    teamId: string;
    teamName: string; // Fallback if ID lookup fails
    matches: number;
    wwcd: number;
    finishPts: number;
    totalPts: number;
}

export interface ScrimSession {
    id: string;
    title: string;
    date: string;
    organizer: string;
    tier: 'T1' | 'T2' | 'T3';
    results: ScrimResult[];
}

export interface VOD {
    id: string;
    title: string;
    thumbnailUrl: string;
    videoUrl: string; // Mock URL for demo
    duration: string;
    views: string;
    uploadDate: string;
    tags: ('Highlight' | 'Full Match' | 'Clutch' | 'Funny' | 'Interview')[];
    featured?: boolean;
    playerId?: string;
    teamIds?: string[];
}

export interface TimelineEvent {
    id: string;
    date: string;
    title: string;
    description: string;
    type: 'Game Update' | 'Tournament' | 'Controversy' | 'Milestone';
    imageUrl?: string;
}

export interface PickemMatch {
    id: number;
    round: number; // 1 (Quarter), 2 (Semi), 3 (Final)
    nextMatchId?: number; // ID of the match the winner advances to
    team1: Team | null;
    team2: Team | null;
    winnerId?: string | null; // User prediction
}

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    unlocked: boolean;
    rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
}

export interface PollOption {
    id: string;
    label: string;
    votes: number;
    userVoted?: boolean;
}

export interface Poll {
    id: string;
    question: string;
    totalVotes: number;
    options: PollOption[];
    userVotedOptionId?: string;
    status: 'Active' | 'Closed';
    endDate?: string;
}

export interface Weapon {
    id: string;
    name: string;
    type: 'AR' | 'SMG' | 'DMR' | 'SR' | 'Shotgun' | 'LMG' | 'Pistol' | 'Melee';
    damage: number;
    fireRate: number; // normalized 0-100 for display
    range: number; // normalized 0-100
    recoil: number; // normalized 0-100 (lower is better)
    ammoType: string;
    tier: 'S' | 'A' | 'B' | 'C';
    image: string;
}

export interface Guide {
    id: string;
    title: string;
    author: string;
    role: string;
    category: 'Mechanics' | 'Macro' | 'Mental' | 'Utility';
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    readTime: string;
    imageUrl: string;
    content: string; // Simple text for demo
    likes: number;
}

export interface GlossaryTerm {
    id: string;
    term: string;
    definition: string;
    example?: string;
    category?: 'General' | 'Combat' | 'Strategy' | 'Macro';
}

export interface CosmeticItem {
    id: string;
    name: string;
    type: 'X-Suit' | 'Gun Lab' | 'Vehicle';
    rarity: 'Mythic' | 'Legendary' | 'Epic';
    image: string;
    maxLevel: number;
    releaseDate: string;
    priceEstimates?: string;
}

export interface PatchNote {
    id: string;
    version: string;
    date: string;
    title: string;
    description: string;
    changes: {
        item: string;
        type: 'Buff' | 'Nerf' | 'Adjustment' | 'New';
        details: string;
    }[];
    impactRating: 'High' | 'Medium' | 'Low';
}

export interface MetaTier {
    tier: 'S' | 'A' | 'B' | 'C';
    items: string[];
}

export interface StoreItem {
    id: string;
    name: string;
    type: 'Avatar' | 'Frame' | 'Title' | 'Banner';
    rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
    price: number;
    image: string;
    description?: string;
}

export interface RecruitmentPost {
    id: string;
    type: 'LFT' | 'LFP'; // LFT = Player looking for Team, LFP = Team looking for Player
    author: string;
    authorId?: string;
    image: string;
    roles: string[];
    tier: 'T1' | 'T2' | 'T3' | 'Open';
    requirements: string;
    postedDate: string;
    status: 'Open' | 'Closed';
}

export interface CrosshairConfig {
    color: string;
    length: number;
    thickness: number;
    gap: number;
    outline: boolean;
    dot: boolean;
}

export interface RouletteChallenge {
    id: string;
    title: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard' | 'Insane';
}

export interface DeviceSpec {
    id: string;
    model: string;
    brand: string;
    processor: string;
    maxFps: '90 FPS' | '60 FPS' | '45 FPS' | '120 FPS';
    gyro: 'Hardware' | 'Software' | 'None';
    battery: string;
    releaseYear: string;
    image: string;
}

export interface ReplayPosition {
    x: number; // 0-100
    y: number; // 0-100
}

export interface ReplayTeam {
    teamId: string;
    color: string;
    path: ReplayPosition[]; // Array of positions over time
}

export interface ReplayData {
    matchId: string;
    mapUrl: string;
    duration: number; // seconds
    teams: ReplayTeam[];
    zoneStates: { time: number; x: number; y: number; radius: number }[];
}

export interface SprayPattern {
    weaponId: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    verticalRecoil: number; // Speed of climb
    horizontalJitter: number; // Randomness
    bullets: number; // Mag size
}

export interface UCPack {
    amount: number;
    bonus: number;
    priceInr: number;
}

export interface NadeLineup {
    id: string;
    title: string;
    map: string;
    location: string;
    type: 'Frag' | 'Smoke' | 'Molotov' | 'Stun';
    difficulty: 'Easy' | 'Medium' | 'Hard' | 'Pixel Perfect';
    standImage: string;
    aimImage: string;
    description: string;
}

export interface RulesetPreset {
    id: string;
    name: string;
    description: string;
    points: string; // e.g. "15 Pt" or "10 Pt"
    maps: string[];
    bans: string[];
}

export interface Vehicle {
    id: string;
    name: string;
    type: 'Land' | 'Water' | 'Air';
    seats: number;
    maxSpeed: number; // km/h
    health: number; // HP
    description: string;
    image: string;
}

export interface DreamTeam {
    name: string;
    players: (Player | null)[];
    synergy: number;
    aggression: number;
    survival: number;
}

export interface TriviaQuestion {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number; // Index
    points: number;
    explanation: string;
}

export interface SensCode {
    id: string;
    player: string;
    code: string;
    type: 'Gyro' | 'Non-Gyro';
    layout: '2 Finger' | '3 Finger' | '4 Finger' | '5 Finger';
    device: 'Mobile' | 'Tablet';
    likes: number;
    lastUpdated: string;
}

export interface Attachment {
    id: string;
    name: string;
    type: 'Muzzle' | 'Grip' | 'Magazine' | 'Stock' | 'Sight';
    stats: {
        recoilVert?: number; // Negative is reduction
        recoilHoriz?: number;
        adsSpeed?: number; // Positive is faster
        stability?: number;
        capacity?: number;
    };
    description: string;
    image: string;
}

export interface Mission {
    id: string;
    title: string;
    description: string;
    reward: number;
    type: 'Daily' | 'Weekly' | 'Special';
    progress: number;
    maxProgress: number;
    completed: boolean;
    claimed: boolean;
    icon?: 'Read' | 'Vote' | 'Create' | 'Win';
}

export interface ClanMember {
    id: string;
    name: string;
    role: 'Leader' | 'Co-Leader' | 'Elite' | 'Member';
    contribution: number;
    lastActive: string;
    avatar: string;
}

export interface Clan {
    id: string;
    name: string;
    level: number;
    motto: string;
    members: ClanMember[];
    requests: { id: string; name: string; kd: number; date: string }[];
    notice: string;
    logo: string;
}
