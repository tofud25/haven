/**
 * Reactive Game State Store for Haven & Bloomr
 * Persists data to localStorage and orchestrates UI updates.
 */

import { HavenGameState, RoomId, RoomDef, BloomrPost, ViewMode, TabletTab } from './types.js';
import { PollinationsClient } from './api/pollinations.js';

const STORAGE_KEY = 'haven_bloomr_save_v2';

const INITIAL_ROOMS: Record<RoomId, RoomDef> = {
  attic: {
    id: 'attic',
    name: 'The attic room',
    cost: 300,
    built: false,
    floor: 'attic',
    desc: 'A quiet, secluded attic with wooden beams, ideal for stargazing or quiet reflection.',
    perks: { comfort: 2 },
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="180" viewBox="0 0 300 180"><rect width="300" height="180" fill="%232b211a"/><polygon points="0,0 150,50 300,0" fill="%231a1410"/><circle cx="150" cy="80" r="18" fill="%23d6a85e" opacity="0.4"/><rect x="80" y="110" width="140" height="50" rx="8" fill="%233d2e24"/></svg>',
  },
  master: {
    id: 'master',
    name: 'The master bedroom',
    cost: 0,
    built: true,
    floor: 'second',
    desc: 'The grand master suite with an ornate canopy bed, wardrobe, and garden view.',
    perks: { beds: 1, comfort: 3 },
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="180" viewBox="0 0 300 180"><rect width="300" height="180" fill="%233e3831"/><rect x="50" y="70" width="120" height="90" fill="%23b8956e" rx="6"/><circle cx="110" cy="50" r="24" fill="%23ffe3b3" opacity="0.2"/></svg>',
  },
  bathroom: {
    id: 'bathroom',
    name: 'The bathroom',
    cost: 0,
    built: true,
    floor: 'second',
    desc: 'A spacious bath tiled in porcelain with a clawfoot soaking tub and hot spring water.',
    perks: { comfort: 2 },
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="180" viewBox="0 0 300 180"><rect width="300" height="180" fill="%232a353d"/><ellipse cx="150" cy="120" rx="80" ry="35" fill="%23e8edf2"/></svg>',
    occupant: 'Elise',
  },
  west_bed: {
    id: 'west_bed',
    name: 'The west bedroom',
    cost: 240,
    built: false,
    floor: 'second',
    desc: 'A cozy west-facing room with evening light and a vintage writing desk.',
    perks: { beds: 1, comfort: 1 },
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="180" viewBox="0 0 300 180"><rect width="300" height="180" fill="%2324201d"/><rect x="60" y="80" width="110" height="70" fill="%23453b34" rx="4"/></svg>',
  },
  east_bed: {
    id: 'east_bed',
    name: 'The east bedroom',
    cost: 240,
    built: false,
    floor: 'second',
    desc: 'A bedroom that gets the morning sun, for someone to make her own.',
    perks: { beds: 1, comfort: 1 },
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="180" viewBox="0 0 300 180"><rect width="300" height="180" fill="%23302a24"/><rect x="70" y="80" width="110" height="70" fill="%236e5949" rx="6"/><circle cx="240" cy="60" r="28" fill="%23ffeaa7" opacity="0.3"/></svg>',
  },
  hearth: {
    id: 'hearth',
    name: 'The hearth room',
    cost: 0,
    built: true,
    floor: 'ground',
    desc: 'The warm center of the house with a large stone fireplace and long wooden dining table.',
    perks: { comfort: 3 },
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="180" viewBox="0 0 300 180"><rect width="300" height="180" fill="%23423023"/><rect x="90" y="90" width="120" height="60" fill="%23a07855" rx="6"/><circle cx="150" cy="70" r="15" fill="%23ff7675" opacity="0.6"/></svg>',
    isPlayerRoom: true,
  },
  family: {
    id: 'family',
    name: 'The family room',
    cost: 240,
    built: false,
    floor: 'ground',
    desc: 'An inviting lounge with plush armchairs and a wide hearth for gathering.',
    perks: { comfort: 2 },
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="180" viewBox="0 0 300 180"><rect width="300" height="180" fill="%232b2620"/><rect x="80" y="100" width="130" height="50" fill="%235c4e43" rx="8"/></svg>',
  },
  garden: {
    id: 'garden',
    name: 'The garden',
    cost: 290,
    built: false,
    floor: 'ground',
    desc: 'A lush courtyard garden planted with fragrant roses, lavender, and an apple tree.',
    perks: { comfort: 2 },
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="180" viewBox="0 0 300 180"><rect width="300" height="180" fill="%231d2b1f"/><circle cx="90" cy="90" r="35" fill="%2327ae60" opacity="0.6"/><circle cx="210" cy="110" r="25" fill="%23e84393" opacity="0.4"/></svg>',
  },
  study: {
    id: 'study',
    name: 'The study',
    cost: 210,
    built: false,
    floor: 'basement',
    desc: 'Lined with oak bookshelves, manuscripts, and a warm bronze reading lamp.',
    perks: { comfort: 1 },
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="180" viewBox="0 0 300 180"><rect width="300" height="180" fill="%231f1e24"/><rect x="40" y="40" width="80" height="110" fill="%23534b52" rx="4"/></svg>',
  },
  nanny: {
    id: 'nanny',
    name: "The nanny's room",
    cost: 0,
    built: true,
    floor: 'basement',
    desc: 'A neat, modest room close to the nursery with floral curtains.',
    perks: { beds: 1, comfort: 1 },
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="180" viewBox="0 0 300 180"><rect width="300" height="180" fill="%232d2926"/><rect x="80" y="80" width="90" height="60" fill="%238a796e" rx="4"/></svg>',
  },
  nursery: {
    id: 'nursery',
    name: 'The nursery',
    cost: 190,
    built: false,
    floor: 'basement',
    desc: 'A gentle room equipped with rocking cradles and painted toy chests.',
    perks: { cots: 1, comfort: 1 },
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="180" viewBox="0 0 300 180"><rect width="300" height="180" fill="%23242022"/><ellipse cx="140" cy="110" rx="40" ry="25" fill="%23e17055" opacity="0.4"/></svg>',
  },
};

function getInitialState(): HavenGameState {
  return {
    viewMode: 'house',
    clockMinutes: 570, // 09:30
    day: 8,
    estate: {
      name: 'Haven House',
      rent: 200,
      rentDueDate: 'Moonday 1 Mistmoon',
      childrenWeek: 0,
      comfort: 1,
      money: 1300,
      rooms: INITIAL_ROOMS,
      selectedRoomId: 'east_bed',
      household: [
        {
          id: 'h_elise',
          name: 'Elise',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          role: 'Student & Housemate',
          room: 'bathroom',
        },
      ],
      ledger: [
        { id: 'l1', date: 'Day 1', desc: 'Starting allowance', amount: 1500, type: 'income' },
        { id: 'l2', date: 'Day 4', desc: 'Rent deposit payment', amount: 200, type: 'expense' },
      ],
    },
    vn: {
      universityName: 'Nordhaven University',
      weekday: 'Monday',
      dateStr: '22 Goldenhay',
      dayCount: 8,
      totalDays: 133,
      locationTitle: 'THE LECTURE HALLS - NETWORKS, PLATFORMS AND PRIVACY',
      courseCode: 'CSC 142',
      timeStr: '09:30',
      sprites: [
        {
          id: 'sp_elowen',
          name: 'Elowen',
          position: 'left',
          spriteUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
          expression: 'smug_blush',
        },
        {
          id: 'sp_morgause',
          name: 'Morgause',
          position: 'right',
          spriteUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
          expression: 'cool',
        },
      ],
      dialogueHistory: [
        {
          speaker: 'Elowen',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
          text: "Bro wants a wikiHow for flirting. Step one: be normal. You're already failing.",
        },
      ],
      currentLineIndex: 0,
    },
    combat: {
      dungeonName: 'THE UNDERCROFT',
      zoneName: 'the Old Drains',
      party: [
        {
          id: 'kael',
          name: 'Kael',
          classTitle: 'Sire',
          hp: 29,
          maxHp: 29,
          mp: 100,
          maxMp: 100,
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
        },
        {
          id: 'elowen',
          name: 'Elowen',
          classTitle: 'Pyromancer',
          hp: 100,
          maxHp: 100,
          mp: 22,
          maxMp: 22,
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
        },
        {
          id: 'caelwen',
          name: 'Caelwen',
          classTitle: 'Wada',
          hp: 22,
          maxHp: 22,
          mp: 22,
          maxMp: 22,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        },
      ],
      enemies: [
        {
          id: 'slime_1',
          name: 'Wild slime',
          hp: 14,
          maxHp: 14,
          spriteUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="180" viewBox="0 0 160 180"><ellipse cx="80" cy="110" rx="65" ry="60" fill="%232ecc71" opacity="0.85"/><circle cx="80" cy="90" r="28" fill="%23a8e6cf"/><ellipse cx="80" cy="160" rx="75" ry="15" fill="%2327ae60" opacity="0.5"/></svg>',
        },
        {
          id: 'slime_2',
          name: 'Wild slime',
          hp: 14,
          maxHp: 14,
          spriteUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="180" viewBox="0 0 160 180"><ellipse cx="80" cy="110" rx="65" ry="60" fill="%232ecc71" opacity="0.85"/><circle cx="80" cy="90" r="28" fill="%23a8e6cf"/><ellipse cx="80" cy="160" rx="75" ry="15" fill="%2327ae60" opacity="0.5"/></svg>',
        },
      ],
      talkingText: 'Talking...',
      speechBubble: {
        speaker: 'Caelwen',
        text: "You may not, and I'd ask what you planned to feed it, but I suspect the answer is 'you'.",
      },
      isCombatActive: true,
      combatLog: ['Encountered 2 Wild slimes in the Old Drains!'],
    },
    tablet: {
      activeTab: 'feed',
      dayTargetTime: 'until 06:00',
      currentShift: 'Bar staff',
      stats: {
        str: 16,
        dex: 16,
        end: 16,
        int: 17,
        cha: 18,
        wis: 15,
        energy: 100,
        maxEnergy: 100,
      },
      jobs: [
        { id: 'j_bar', title: 'Bar staff', location: 'The Tiltyard Tavern', wage: 45, active: true },
        { id: 'j_lib', title: 'Archive Scribe', location: 'Grand Library', wage: 35, active: false },
      ],
      dms: [
        {
          id: 'dm_faye',
          partnerName: 'Faye Fertillay',
          partnerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
          unreadCount: 2,
          messages: [
            { sender: 'them', text: 'Hey, are you joining us at the café before lecture?', time: '11:45' },
            { sender: 'them', text: 'Isolde brought the notes for CSC 142!', time: '11:50' },
          ],
        },
      ],
      feed: [
        {
          id: 'post_1',
          authorName: 'Faye Fertillay',
          authorHandle: '@faye_accompli',
          authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
          timestamp: 'earlier today',
          mentions: ['@i_carry_the_one'],
          content: 'Midday coffee break with Isolde. Preparing our defense for tomorrow’s enchantment lab!',
          imageUrl: PollinationsClient.getImageUrl({
            prompt: 'two stylish academy anime girls sitting in a cozy warm cafe with glowing runes in background',
            width: 800,
            height: 600,
            model: 'flux',
          }),
          likes: 42,
          comments: [
            { id: 'c1', author: 'Isolde', text: 'Next time don’t spill your chai on my grimoire.', time: '1h ago' },
          ],
        },
      ],
    },
  };
}

export class GameStore {
  private static instance: GameStore;
  private state: HavenGameState;
  private listeners: Set<() => void> = new Set();

  private constructor() {
    this.state = this.loadState();
  }

  public static get(): GameStore {
    if (!GameStore.instance) {
      GameStore.instance = new GameStore();
    }
    return GameStore.instance;
  }

  public getState(): HavenGameState {
    return this.state;
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public notify(): void {
    this.saveState();
    this.listeners.forEach((fn) => fn());
  }

  public setViewMode(mode: ViewMode): void {
    this.state.viewMode = mode;
    this.notify();
  }

  public selectRoom(roomId: RoomId): void {
    this.state.estate.selectedRoomId = roomId;
    this.notify();
  }

  public buildRoom(roomId: RoomId): boolean {
    const room = this.state.estate.rooms[roomId];
    if (!room || room.built) return false;
    if (this.state.estate.money < room.cost) return false;

    this.state.estate.money -= room.cost;
    room.built = true;
    if (room.perks.comfort) this.state.estate.comfort += room.perks.comfort;

    this.state.estate.ledger.unshift({
      id: `l_${Date.now()}`,
      date: `Day ${this.state.day}`,
      desc: `Constructed ${room.name}`,
      amount: room.cost,
      type: 'expense',
    });

    this.notify();
    return true;
  }

  public addVnLine(speaker: string, avatar: string, text: string): void {
    this.state.vn.dialogueHistory.push({ speaker, avatar, text });
    this.state.vn.currentLineIndex = this.state.vn.dialogueHistory.length - 1;
    this.notify();
  }

  public attackEnemy(enemyId: string, damage = 7): void {
    const enemy = this.state.combat.enemies.find((e) => e.id === enemyId);
    if (!enemy) return;

    enemy.hp = Math.max(0, enemy.hp - damage);
    this.state.combat.combatLog.unshift(`Player attacked ${enemy.name} for ${damage} damage!`);

    if (enemy.hp === 0) {
      this.state.combat.combatLog.unshift(`${enemy.name} was defeated! Received +$35 gold.`);
      this.state.estate.money += 35;
      this.state.combat.enemies = this.state.combat.enemies.filter((e) => e.id !== enemyId);
    }

    this.notify();
  }

  public likePost(postId: string): void {
    const post = this.state.tablet.feed.find((p) => p.id === postId);
    if (post) {
      post.likes += 1;
      this.notify();
    }
  }

  public addComment(postId: string, text: string): void {
    const post = this.state.tablet.feed.find((p) => p.id === postId);
    if (post && text.trim()) {
      post.comments.push({
        id: `c_${Date.now()}`,
        author: 'You',
        text: text.trim(),
        time: 'Just now',
      });
      this.notify();
    }
  }

  public createPost(content: string, imageUrl?: string): void {
    if (!content.trim()) return;
    const newPost: BloomrPost = {
      id: `p_${Date.now()}`,
      authorName: 'Mundi Explorer',
      authorHandle: '@wanderer',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      timestamp: 'Just now',
      mentions: ['@haven'],
      content: content.trim(),
      imageUrl,
      likes: 0,
      comments: [],
    };
    this.state.tablet.feed.unshift(newPost);
    this.notify();
  }

  public sendDM(threadId: string, text: string): void {
    const thread = this.state.tablet.dms.find((d) => d.id === threadId);
    if (thread && text.trim()) {
      thread.messages.push({
        sender: 'me',
        text: text.trim(),
        time: 'Just now',
      });
      this.notify();
    }
  }

  public lootDungeon(): void {
    const earned = Math.floor(Math.random() * 40) + 15;
    this.state.estate.money += earned;
    this.state.combat.combatLog.unshift(`Searched the catacombs and discovered +$${earned} gold and ancient relics.`);
    this.notify();
  }

  public restDungeon(): void {
    this.state.combat.party.forEach((p) => {
      p.hp = p.maxHp;
      p.mp = p.maxMp;
    });
    this.state.combat.combatLog.unshift(`The party rested by the campfire. All HP and MP fully restored!`);
    this.notify();
  }

  public resetDungeon(): void {
    this.state.combat.enemies = [
      { id: `e_${Date.now()}_1`, name: 'Amorphous Slime', hp: 35, maxHp: 35, spriteUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M20,70 Q10,40 35,30 Q50,15 65,30 Q90,40 80,70 Q70,85 50,85 Q30,85 20,70 Z" fill="%2322c55e" opacity="0.85"/><circle cx="40" cy="48" r="5" fill="%230f172a"/><circle cx="60" cy="48" r="5" fill="%230f172a"/><circle cx="42" cy="46" r="1.5" fill="%23ffffff"/><circle cx="62" cy="46" r="1.5" fill="%23ffffff"/></svg>' },
      { id: `e_${Date.now()}_2`, name: 'Cavern Ooze', hp: 45, maxHp: 45, spriteUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M15,75 Q10,35 40,25 Q55,10 70,25 Q90,35 85,75 Q75,90 50,90 Q25,90 15,75 Z" fill="%2306b6d4" opacity="0.85"/><circle cx="38" cy="45" r="6" fill="%230f172a"/><circle cx="62" cy="45" r="6" fill="%230f172a"/></svg>' },
    ];
    this.state.combat.combatLog.unshift(`A new wave of creatures emerged from the deep waters!`);
    this.notify();
  }

  public advanceTime(minutes = 60): void {
    this.state.clockMinutes = (this.state.clockMinutes + minutes) % 1440;
    if (this.state.clockMinutes < minutes) {
      this.state.day += 1;
      this.state.vn.dayCount += 1;
    }
    const hrs = Math.floor(this.state.clockMinutes / 60);
    const mins = this.state.clockMinutes % 60;
    const ampm = hrs >= 12 ? 'PM' : 'AM';
    const displayHrs = hrs % 12 === 0 ? 12 : hrs % 12;
    this.state.vn.timeStr = `${String(displayHrs).padStart(2, '0')}:${String(mins).padStart(2, '0')} ${ampm}`;
    this.notify();
  }

  public setTabletTab(tab: TabletTab): void {
    this.state.tablet.activeTab = tab;
    this.notify();
  }

  public sendChatMessage(text: string): void {
    if (!text.trim()) return;
    this.addVnLine('You', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80', text.trim());
  }

  private saveState(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // Ignore quota errors
    }
  }

  private loadState(): HavenGameState {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {
      // fallback
    }
    return getInitialState();
  }
}
