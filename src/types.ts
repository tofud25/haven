/**
 * Haven & Bloomr: Universal Game Types & Architecture Definitions
 */

export type ViewMode = 'house' | 'vn' | 'combat' | 'tablet';

// ==========================================
// 1. HAVEN HOUSE (Dollhouse Estate Management)
// ==========================================
export type RoomId =
  | 'attic'
  | 'master'
  | 'bathroom'
  | 'west_bed'
  | 'east_bed'
  | 'hearth'
  | 'family'
  | 'garden'
  | 'study'
  | 'nanny'
  | 'nursery';

export interface RoomPerks {
  beds?: number;
  cots?: number;
  comfort?: number;
}

export interface RoomDef {
  id: RoomId;
  name: string;
  cost: number;
  built: boolean;
  floor: 'attic' | 'second' | 'ground' | 'basement';
  desc: string;
  perks: RoomPerks;
  image: string;
  occupant?: string;
  isPlayerRoom?: boolean;
}

export interface HouseholdResident {
  id: string;
  name: string;
  avatar: string;
  role: string;
  room?: RoomId;
}

export interface EstateState {
  name: string;
  rent: number;
  rentDueDate: string;
  childrenWeek: number;
  comfort: number;
  money: number;
  rooms: Record<RoomId, RoomDef>;
  selectedRoomId: RoomId;
  household: HouseholdResident[];
  ledger: { id: string; date: string; desc: string; amount: number; type: 'income' | 'expense' }[];
}

// ==========================================
// 2. VISUAL NOVEL & ACADEMY (Nordhaven University)
// ==========================================
export interface VnSprite {
  id: string;
  name: string;
  spriteUrl: string;
  position: 'left' | 'right' | 'center';
  expression?: string;
}

export interface VnLine {
  speaker: string;
  avatar: string;
  text: string;
}

export interface VnState {
  universityName: string;
  weekday: string;
  dateStr: string;
  dayCount: number;
  totalDays: number;
  locationTitle: string;
  courseCode: string;
  timeStr: string;
  sprites: VnSprite[];
  dialogueHistory: VnLine[];
  currentLineIndex: number;
}

// ==========================================
// 3. THE UNDERCROFT (Dungeon RPG & Combat)
// ==========================================
export interface PartyMember {
  id: string;
  name: string;
  classTitle: string;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  avatar: string;
}

export interface MonsterEnemy {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  spriteUrl: string;
}

export interface CombatState {
  dungeonName: string;
  zoneName: string;
  party: PartyMember[];
  enemies: MonsterEnemy[];
  talkingText: string;
  speechBubble?: { speaker: string; text: string };
  isCombatActive: boolean;
  combatLog: string[];
}

// ==========================================
// 4. BLOOMR TABLET OS (In-Game Social Media)
// ==========================================
export type TabletTab = 'dms' | 'friends' | 'feed' | 'jobs' | 'societies' | 'market' | 'stats';

export interface BloomrComment {
  id: string;
  author: string;
  text: string;
  time: string;
}

export interface BloomrPost {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  timestamp: string;
  mentions: string[];
  content: string;
  imageUrl?: string;
  likes: number;
  comments: BloomrComment[];
}

export interface BloomrDMMessage {
  sender: 'me' | 'them';
  text: string;
  time: string;
}

export interface BloomrDMThread {
  id: string;
  partnerName: string;
  partnerAvatar: string;
  unreadCount: number;
  messages: BloomrDMMessage[];
}

export interface PlayerStats {
  str: number;
  dex: number;
  end: number;
  int: number;
  cha: number;
  wis: number;
  energy: number;
  maxEnergy: number;
}

export interface JobShift {
  id: string;
  title: string;
  location: string;
  wage: number;
  active: boolean;
}

export interface TabletState {
  activeTab: TabletTab;
  feed: BloomrPost[];
  dms: BloomrDMThread[];
  activeDmId?: string;
  jobs: JobShift[];
  stats: PlayerStats;
  currentShift: string;
  dayTargetTime: string;
}

// ==========================================
// 5. GLOBAL GAME STATE
// ==========================================
export interface HavenGameState {
  viewMode: ViewMode;
  estate: EstateState;
  vn: VnState;
  combat: CombatState;
  tablet: TabletState;
  clockMinutes: number;
  day: number;
}
