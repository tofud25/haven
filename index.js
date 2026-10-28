/**
 * Haven: Life, Academy & Dungeon Archetype (v2.0)
 * Standalone SillyTavern Extension Bundle
 */

/* --- pollinations.js --- */
/**
 * Pollinations AI: Free, high-speed, unauthenticated AI image generator
 * Powers dynamic photo generation for Bloomr social feed posts.
 */
class PollinationsClient {
    static BASE_URL = 'https://image.pollinations.ai/prompt';
    /**
     * Generates a direct URL for an AI generated image.
     * Format: https://image.pollinations.ai/prompt/{encoded_prompt}?width=...&height=...&model=...
     */
    static getImageUrl(options) {
        const { prompt, width = 800, height = 600, seed = Math.floor(Math.random() * 9999999), model = 'flux', enhance = true, } = options;
        const encodedPrompt = encodeURIComponent(prompt.trim());
        const query = new URLSearchParams({
            width: String(width),
            height: String(height),
            seed: String(seed),
            model,
            enhance: enhance ? 'true' : 'false',
            nologo: 'true',
        });
        return `${this.BASE_URL}/${encodedPrompt}?${query.toString()}`;
    }
    /**
     * Generates a contextual prompt for an NPC social post.
     */
    static createSocialPostPrompt(characterName, activity, location) {
        return `masterpiece, high quality anime semi-realistic art, ${characterName} in ${location}, ${activity}, aesthetic lighting, cinematic composition, depth of field, vibrant colors, detailed clothing and environment`;
    }
}

/* --- state.js --- */
/**
 * Reactive Game State Store for Haven & Bloomr
 * Persists data to localStorage and orchestrates UI updates.
 */

const STORAGE_KEY = 'haven_bloomr_save_v2';
const INITIAL_ROOMS = {
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
function getInitialState() {
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
class GameStore {
    static instance;
    state;
    listeners = new Set();
    constructor() {
        this.state = this.loadState();
    }
    static get() {
        if (!GameStore.instance) {
            GameStore.instance = new GameStore();
        }
        return GameStore.instance;
    }
    getState() {
        return this.state;
    }
    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }
    notify() {
        this.saveState();
        this.listeners.forEach((fn) => fn());
    }
    setViewMode(mode) {
        this.state.viewMode = mode;
        this.notify();
    }
    selectRoom(roomId) {
        this.state.estate.selectedRoomId = roomId;
        this.notify();
    }
    buildRoom(roomId) {
        const room = this.state.estate.rooms[roomId];
        if (!room || room.built)
            return false;
        if (this.state.estate.money < room.cost)
            return false;
        this.state.estate.money -= room.cost;
        room.built = true;
        if (room.perks.comfort)
            this.state.estate.comfort += room.perks.comfort;
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
    addVnLine(speaker, avatar, text) {
        this.state.vn.dialogueHistory.push({ speaker, avatar, text });
        this.state.vn.currentLineIndex = this.state.vn.dialogueHistory.length - 1;
        this.notify();
    }
    attackEnemy(enemyId, damage = 7) {
        const enemy = this.state.combat.enemies.find((e) => e.id === enemyId);
        if (!enemy)
            return;
        enemy.hp = Math.max(0, enemy.hp - damage);
        this.state.combat.combatLog.unshift(`Player attacked ${enemy.name} for ${damage} damage!`);
        if (enemy.hp === 0) {
            this.state.combat.combatLog.unshift(`${enemy.name} was defeated! Received +$35 gold.`);
            this.state.estate.money += 35;
            this.state.combat.enemies = this.state.combat.enemies.filter((e) => e.id !== enemyId);
        }
        this.notify();
    }
    likePost(postId) {
        const post = this.state.tablet.feed.find((p) => p.id === postId);
        if (post) {
            post.likes += 1;
            this.notify();
        }
    }
    addComment(postId, text) {
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
    createPost(content, imageUrl) {
        if (!content.trim())
            return;
        const newPost = {
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
    sendDM(threadId, text) {
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
    lootDungeon() {
        const earned = Math.floor(Math.random() * 40) + 15;
        this.state.estate.money += earned;
        this.state.combat.combatLog.unshift(`Searched the catacombs and discovered +$${earned} gold and ancient relics.`);
        this.notify();
    }
    restDungeon() {
        this.state.combat.party.forEach((p) => {
            p.hp = p.maxHp;
            p.mp = p.maxMp;
        });
        this.state.combat.combatLog.unshift(`The party rested by the campfire. All HP and MP fully restored!`);
        this.notify();
    }
    resetDungeon() {
        this.state.combat.enemies = [
            { id: `e_${Date.now()}_1`, name: 'Amorphous Slime', hp: 35, maxHp: 35, spriteUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M20,70 Q10,40 35,30 Q50,15 65,30 Q90,40 80,70 Q70,85 50,85 Q30,85 20,70 Z" fill="%2322c55e" opacity="0.85"/><circle cx="40" cy="48" r="5" fill="%230f172a"/><circle cx="60" cy="48" r="5" fill="%230f172a"/><circle cx="42" cy="46" r="1.5" fill="%23ffffff"/><circle cx="62" cy="46" r="1.5" fill="%23ffffff"/></svg>' },
            { id: `e_${Date.now()}_2`, name: 'Cavern Ooze', hp: 45, maxHp: 45, spriteUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M15,75 Q10,35 40,25 Q55,10 70,25 Q90,35 85,75 Q75,90 50,90 Q25,90 15,75 Z" fill="%2306b6d4" opacity="0.85"/><circle cx="38" cy="45" r="6" fill="%230f172a"/><circle cx="62" cy="45" r="6" fill="%230f172a"/></svg>' },
        ];
        this.state.combat.combatLog.unshift(`A new wave of creatures emerged from the deep waters!`);
        this.notify();
    }
    advanceTime(minutes = 60) {
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
    setTabletTab(tab) {
        this.state.tablet.activeTab = tab;
        this.notify();
    }
    sendChatMessage(text) {
        if (!text.trim())
            return;
        this.addVnLine('You', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80', text.trim());
    }
    saveState() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
        }
        catch {
            // Ignore quota errors
        }
    }
    loadState() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                return JSON.parse(raw);
            }
        }
        catch {
            // fallback
        }
        return getInitialState();
    }
}

/* --- nav.js --- */
/**
 * Global Top Navigation Bar for Haven & Bloomr
 */
class NavComponent {
    store;
    constructor() {
        this.store = GameStore.get();
    }
    render() {
        const state = this.store.getState();
        const active = state.viewMode;
        return `
      <header class="haven-nav-header">
        <div class="haven-nav-left">
          <div class="haven-brand">
            <span class="haven-brand-gem">✦</span>
            <span class="haven-brand-title">HAVEN</span>
            <span class="haven-brand-sub">ARCHETYPE</span>
          </div>
          
          <nav class="haven-nav-modes" role="tablist">
            <button class="haven-nav-btn ${active === 'house' ? 'active' : ''}" data-mode="house" title="Haven House Estate Management">
              <span class="haven-nav-icon">🏰</span>
              <span class="haven-nav-label">Haven House</span>
            </button>
            <button class="haven-nav-btn ${active === 'vn' ? 'active' : ''}" data-mode="vn" title="Nordhaven Academy Visual Novel">
              <span class="haven-nav-icon">🎓</span>
              <span class="haven-nav-label">Academy VN</span>
            </button>
            <button class="haven-nav-btn ${active === 'combat' ? 'active' : ''}" data-mode="combat" title="The Undercroft Dungeon RPG">
              <span class="haven-nav-icon">⚔️</span>
              <span class="haven-nav-label">Undercroft</span>
            </button>
            <button class="haven-nav-btn ${active === 'tablet' ? 'active' : ''}" data-mode="tablet" title="Bloomr Simulated Tablet OS">
              <span class="haven-nav-icon">📱</span>
              <span class="haven-nav-label">Bloomr OS</span>
            </button>
          </nav>
        </div>

        <div class="haven-nav-right">
          <div class="haven-hud-chip haven-hud-money" title="Estate Funds">
            <span class="hud-icon">💰</span>
            <span class="hud-val">$${state.estate.money.toLocaleString()}</span>
          </div>

          <div class="haven-hud-chip haven-hud-time" title="World Calendar & Clock">
            <span class="hud-icon">⏳</span>
            <span class="hud-val">Day ${state.day} • ${state.vn.timeStr}</span>
          </div>

          <div class="haven-hud-chip haven-hud-comfort" title="Estate Comfort Rating">
            <span class="hud-icon">🛋️</span>
            <span class="hud-val">${state.estate.comfort} Comfort</span>
          </div>

          <button class="haven-hud-btn" id="haven-btn-time-advance" title="Advance Time 1 Hour">
            ⏩ +1h
          </button>

          <button class="haven-hud-btn haven-btn-sync" id="haven-btn-prompt-sync" title="Sync Context with SillyTavern Chat">
            🔄 LLM Sync
          </button>
        </div>
      </header>
    `;
    }
    attachEvents(root) {
        root.querySelectorAll('.haven-nav-btn').forEach((btn) => {
            btn.addEventListener('click', () => {
                const mode = btn.dataset.mode;
                if (mode) {
                    this.store.setViewMode(mode);
                }
            });
        });
        const advanceBtn = root.querySelector('#haven-btn-time-advance');
        if (advanceBtn) {
            advanceBtn.addEventListener('click', () => {
                this.store.advanceTime(60);
            });
        }
        const syncBtn = root.querySelector('#haven-btn-prompt-sync');
        if (syncBtn) {
            syncBtn.addEventListener('click', () => {
                // Emit custom event for prompt syncing
                window.dispatchEvent(new CustomEvent('haven:sync-prompt'));
            });
        }
    }
}

/* --- house.js --- */
/**
 * Haven House - Dollhouse Cross-Section Estate Management UI
 * Matches Screenshot 1 layout and features.
 */
class HouseComponent {
    store;
    constructor() {
        this.store = GameStore.get();
    }
    render() {
        const { estate } = this.store.getState();
        const selectedRoom = estate.rooms[estate.selectedRoomId] || estate.rooms.hearth;
        return `
      <div class="haven-house-container">
        <!-- LEFT PANEL: Financial Ledger & Household -->
        <aside class="haven-house-sidebar">
          <div class="haven-card haven-estate-header-card">
            <div class="haven-card-sub">ESTATE OVERVIEW</div>
            <h2 class="haven-estate-name">${estate.name}</h2>
            
            <div class="haven-estate-stats-grid">
              <div class="haven-stat-box">
                <span class="stat-label">Cash Ledger</span>
                <span class="stat-val text-gold">$${estate.money.toLocaleString()}</span>
              </div>
              <div class="haven-stat-box">
                <span class="stat-label">Rent (Weekly)</span>
                <span class="stat-val text-red">-$${estate.rent}</span>
              </div>
              <div class="haven-stat-box">
                <span class="stat-label">Rent Due In</span>
                <span class="stat-val">${estate.rentDueDate}</span>
              </div>
              <div class="haven-stat-box">
                <span class="stat-label">Children/Wk</span>
                <span class="stat-val">${estate.childrenWeek}</span>
              </div>
              <div class="haven-stat-box">
                <span class="stat-label">Total Comfort</span>
                <span class="stat-val text-green">${estate.comfort} ⭐</span>
              </div>
              <div class="haven-stat-box">
                <span class="stat-label">Built Rooms</span>
                <span class="stat-val">${Object.values(estate.rooms).filter(r => r.built).length} / 11</span>
              </div>
            </div>
          </div>

          <!-- RESIDENTS LIST -->
          <div class="haven-card haven-residents-card">
            <div class="haven-card-title">
              <span>Household Residents</span>
              <span class="haven-badge">${estate.household.length}</span>
            </div>
            <div class="haven-residents-list">
              ${estate.household.map((res) => `
                <div class="haven-resident-item">
                  <img src="${res.avatar}" alt="${res.name}" class="haven-resident-avatar" />
                  <div class="haven-resident-info">
                    <div class="haven-resident-name">${res.name}</div>
                    <div class="haven-resident-role">${res.role}</div>
                  </div>
                  <div class="haven-resident-room-tag">${res.room ? estate.rooms[res.room]?.name.replace('The ', '') : 'Unassigned'}</div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- LEDGER HISTORY -->
          <div class="haven-card haven-ledger-card">
            <div class="haven-card-title">
              <span>Financial Ledger</span>
              <span class="haven-tag">Recent</span>
            </div>
            <div class="haven-ledger-list">
              ${estate.ledger.slice(0, 8).map((entry) => `
                <div class="haven-ledger-row">
                  <span class="ledger-date">${entry.date}</span>
                  <span class="ledger-desc" title="${entry.desc}">${entry.desc}</span>
                  <span class="ledger-amt ${entry.type === 'income' ? 'income' : 'expense'}">
                    ${entry.type === 'income' ? '+' : '-'}$${entry.amount}
                  </span>
                </div>
              `).join('')}
            </div>
          </div>
        </aside>

        <!-- MAIN VIEW: Cross-section Dollhouse -->
        <main class="haven-house-main">
          <div class="haven-dollhouse-header">
            <div>
              <h2 class="haven-dollhouse-title">Architectural Cross-Section</h2>
              <p class="haven-dollhouse-subtitle">Select any room chamber to inspect perks, assign tenants, or expand construction.</p>
            </div>
            <div class="haven-dollhouse-legend">
              <span class="legend-item"><span class="legend-dot built"></span> Built</span>
              <span class="legend-item"><span class="legend-dot unbuilt"></span> Blueprint</span>
              <span class="legend-item"><span class="legend-dot occupied"></span> Occupied</span>
            </div>
          </div>

          <!-- 4-TIER CUTAWAY DOLLHOUSE -->
          <div class="haven-dollhouse-framework">
            
            <!-- ATTIC FLOOR -->
            <div class="haven-floor-row attic-floor">
              <div class="floor-badge">Roof & Attic</div>
              <div class="floor-chambers">
                ${this.renderRoomCard(estate.rooms.attic, selectedRoom.id)}
              </div>
            </div>

            <!-- SECOND FLOOR -->
            <div class="haven-floor-row second-floor">
              <div class="floor-badge">2nd Floor (Bedchambers & Bath)</div>
              <div class="floor-chambers">
                ${this.renderRoomCard(estate.rooms.west_bed, selectedRoom.id)}
                ${this.renderRoomCard(estate.rooms.master, selectedRoom.id)}
                ${this.renderRoomCard(estate.rooms.bathroom, selectedRoom.id)}
                ${this.renderRoomCard(estate.rooms.east_bed, selectedRoom.id)}
              </div>
            </div>

            <!-- GROUND FLOOR -->
            <div class="haven-floor-row ground-floor">
              <div class="floor-badge">Ground Floor (Living & Courtyard)</div>
              <div class="floor-chambers">
                ${this.renderRoomCard(estate.rooms.hearth, selectedRoom.id)}
                ${this.renderRoomCard(estate.rooms.family, selectedRoom.id)}
                ${this.renderRoomCard(estate.rooms.garden, selectedRoom.id)}
              </div>
            </div>

            <!-- BASEMENT -->
            <div class="haven-floor-row basement-floor">
              <div class="floor-badge">Basement (Vault & Quarters)</div>
              <div class="floor-chambers">
                ${this.renderRoomCard(estate.rooms.study, selectedRoom.id)}
                ${this.renderRoomCard(estate.rooms.nanny, selectedRoom.id)}
                ${this.renderRoomCard(estate.rooms.nursery, selectedRoom.id)}
              </div>
            </div>

          </div>

          <!-- ROOM INSPECTOR DRAWER / FOOTER -->
          <div class="haven-room-inspector">
            <div class="inspector-art" style="background-image: url('${selectedRoom.image}')">
              <div class="inspector-art-overlay">
                <span class="inspector-floor-tag">${selectedRoom.floor.toUpperCase()} FLOOR</span>
                <h3 class="inspector-title">${selectedRoom.name}</h3>
              </div>
            </div>

            <div class="inspector-details">
              <p class="inspector-desc">${selectedRoom.desc}</p>
              
              <div class="inspector-perks-row">
                ${selectedRoom.perks.comfort ? `<div class="perk-pill">🛋️ Comfort +${selectedRoom.perks.comfort}</div>` : ''}
                ${selectedRoom.perks.beds ? `<div class="perk-pill">🛏️ Beds: ${selectedRoom.perks.beds}</div>` : ''}
                ${selectedRoom.perks.cots ? `<div class="perk-pill">🍼 Cots: ${selectedRoom.perks.cots}</div>` : ''}
                ${selectedRoom.occupant ? `<div class="perk-pill occupant">👤 Resident: ${selectedRoom.occupant}</div>` : ''}
                ${selectedRoom.isPlayerRoom ? `<div class="perk-pill player">⭐ Player Quarters</div>` : ''}
              </div>
            </div>

            <div class="inspector-actions">
              ${selectedRoom.built
            ? `
                  <div class="status-built-badge">
                    <span class="icon">✓</span> Constructed & Functional
                  </div>
                  <button class="haven-btn haven-btn-secondary" id="haven-btn-visit-room">
                    🚪 Enter Room
                  </button>
                `
            : `
                  <div class="cost-notice">
                    Construction Cost: <strong class="text-gold">$${selectedRoom.cost}</strong>
                  </div>
                  <button 
                    class="haven-btn haven-btn-primary" 
                    id="haven-btn-build-room"
                    data-room-id="${selectedRoom.id}"
                    ${estate.money < selectedRoom.cost ? 'disabled' : ''}
                  >
                    🔨 Build Room ($${selectedRoom.cost})
                  </button>
                `}
            </div>
          </div>
        </main>
      </div>
    `;
    }
    renderRoomCard(room, selectedId) {
        const isSelected = room.id === selectedId;
        return `
      <div 
        class="haven-dollhouse-chamber ${room.built ? 'is-built' : 'is-unbuilt'} ${isSelected ? 'is-selected' : ''}" 
        data-room-id="${room.id}"
        title="Click to inspect ${room.name}"
      >
        <div class="chamber-bg" style="background-image: url('${room.image}')"></div>
        <div class="chamber-overlay">
          <div class="chamber-top">
            <span class="chamber-name">${room.name}</span>
            ${room.isPlayerRoom ? '<span class="chamber-marker player">★</span>' : ''}
          </div>
          
          <div class="chamber-bottom">
            ${room.built
            ? `<span class="chamber-status ok">${room.occupant ? `👤 ${room.occupant}` : 'Empty'}</span>`
            : `<span class="chamber-status unbuilt">🔨 $${room.cost}</span>`}
          </div>
        </div>
      </div>
    `;
    }
    attachEvents(root) {
        root.querySelectorAll('.haven-dollhouse-chamber').forEach((el) => {
            el.addEventListener('click', () => {
                const roomId = el.dataset.roomId;
                if (roomId) {
                    this.store.selectRoom(roomId);
                }
            });
        });
        const buildBtn = root.querySelector('#haven-btn-build-room');
        if (buildBtn) {
            buildBtn.addEventListener('click', () => {
                const roomId = buildBtn.dataset.roomId;
                if (roomId) {
                    const success = this.store.buildRoom(roomId);
                    if (!success) {
                        alert('Not enough cash in the estate ledger to fund this room!');
                    }
                }
            });
        }
        const enterBtn = root.querySelector('#haven-btn-visit-room');
        if (enterBtn) {
            enterBtn.addEventListener('click', () => {
                const state = this.store.getState();
                const room = state.estate.rooms[state.estate.selectedRoomId];
                this.store.addVnLine('System', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80', `You entered ${room.name}. ${room.desc}`);
                this.store.setViewMode('vn');
            });
        }
    }
}

/* --- vn.js --- */
/**
 * Nordhaven Academy Visual Novel UI
 * Matches Screenshot 2 layout and features.
 */
class VnComponent {
    store;
    constructor() {
        this.store = GameStore.get();
    }
    render() {
        const { vn } = this.store.getState();
        const currentLine = vn.dialogueHistory[vn.currentLineIndex] || {
            speaker: 'Elowen Frost',
            avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
            text: 'Good morning. Professor Sterling said today\'s lecture on runic architecture will be crucial for the mid-term examinations...',
        };
        return `
      <div class="haven-vn-container">
        <!-- TOP ACADEMY HEADER -->
        <header class="haven-vn-header">
          <div class="academy-badge-group">
            <span class="academy-crest">🏛️</span>
            <div>
              <div class="academy-name">${vn.universityName}</div>
              <div class="academy-sub">${vn.courseCode} • ${vn.locationTitle}</div>
            </div>
          </div>

          <div class="academy-time-group">
            <div class="academy-date-pill">
              <span class="calendar-icon">📅</span>
              <span>${vn.weekday}, ${vn.dateStr}</span>
              <span class="day-count-tag">Day ${vn.dayCount} / ${vn.totalDays}</span>
            </div>
            <div class="academy-clock-pill">
              <span class="clock-icon">🕒</span>
              <span>${vn.timeStr}</span>
            </div>
          </div>
        </header>

        <!-- MAIN STAGE: Character Sprites & Background -->
        <div class="haven-vn-stage">
          <div class="stage-scenery"></div>
          <div class="stage-lighting-overlay"></div>

          <!-- CHARACTER SPRITES (Elowen & Morgause) -->
          <div class="stage-sprites-container">
            ${vn.sprites.map((sprite) => `
              <div class="stage-sprite-wrapper sprite-${sprite.position}" data-sprite-id="${sprite.id}">
                <div class="sprite-glow"></div>
                <img src="${sprite.spriteUrl}" alt="${sprite.name}" class="vn-character-sprite" />
                <div class="sprite-nametag">${sprite.name}</div>
              </div>
            `).join('')}
          </div>

          <!-- FLOATING QUICK HUD ACTIONS (RIGHT SIDE) -->
          <aside class="haven-vn-quick-hud">
            <div class="quick-hud-card">
              <div class="hud-title">ACADEMY AFFINITY</div>
              <div class="affinity-row">
                <span class="char-name">Elowen</span>
                <div class="affinity-bar"><div class="affinity-fill" style="width: 74%;"></div></div>
                <span class="affinity-val">74%</span>
              </div>
              <div class="affinity-row">
                <span class="char-name">Morgause</span>
                <div class="affinity-bar"><div class="affinity-fill" style="width: 61%;"></div></div>
                <span class="affinity-val">61%</span>
              </div>
            </div>

            <div class="quick-actions-list">
              <button class="vn-action-pill" data-action="Take thorough lecture notes on runic formulas">
                📝 Take Notes
              </button>
              <button class="vn-action-pill" data-action="Raise your hand and question Professor Sterling's hypothesis">
                🙋 Ask Professor
              </button>
              <button class="vn-action-pill" data-action="Lean over and whisper softly to Elowen">
                💬 Whisper to Elowen
              </button>
              <button class="vn-action-pill" data-action="Catch Morgause's gaze across the lecture hall aisle">
                👀 Glance at Morgause
              </button>
            </div>
          </aside>
        </div>

        <!-- DIALOGUE BOX (Visual Novel Typewriter Area) -->
        <div class="haven-vn-dialogue-section">
          <div class="dialogue-box-frame">
            <div class="dialogue-header">
              <div class="speaker-tag">
                <span class="speaker-indicator"></span>
                <span class="speaker-name">${currentLine.speaker}</span>
              </div>
              
              <div class="dialogue-nav-controls">
                <button class="dialogue-tool-btn" id="vn-prev-line" title="Previous Line" ${vn.currentLineIndex <= 0 ? 'disabled' : ''}>◀ Prev</button>
                <span class="dialogue-counter">${vn.currentLineIndex + 1} / ${vn.dialogueHistory.length}</span>
                <button class="dialogue-tool-btn" id="vn-next-line" title="Next Line" ${vn.currentLineIndex >= vn.dialogueHistory.length - 1 ? 'disabled' : ''}>Next ▶</button>
                <button class="dialogue-tool-btn" id="vn-backlog-btn" title="View Dialogue Log">📜 Log</button>
                <button class="dialogue-tool-btn" id="vn-auto-btn" title="Toggle Auto-advance">⏩ Auto</button>
              </div>
            </div>

            <div class="dialogue-content-area">
              <img src="${currentLine.avatar}" alt="${currentLine.speaker}" class="dialogue-avatar" />
              <div class="dialogue-text-bubble">
                <p class="dialogue-text">${currentLine.text}</p>
              </div>
            </div>

            <!-- CHAT INPUT / ROLEPLAY PROMPT BAR -->
            <form class="haven-vn-input-bar" id="haven-vn-form">
              <input 
                type="text" 
                id="haven-vn-input" 
                class="haven-input" 
                placeholder="Type your response or take an action in lecture..." 
                autocomplete="off"
              />
              <button type="submit" class="haven-btn haven-btn-primary haven-btn-send">
                <span>Send</span> ✦
              </button>
            </form>
          </div>
        </div>
      </div>
    `;
    }
    attachEvents(root) {
        const form = root.querySelector('#haven-vn-form');
        const input = root.querySelector('#haven-vn-input');
        if (form && input) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const val = input.value.trim();
                if (val) {
                    this.store.sendChatMessage(val);
                    input.value = '';
                    // Trigger SillyTavern message injection
                    window.dispatchEvent(new CustomEvent('haven:user-action', { detail: { text: val } }));
                }
            });
        }
        // Quick Action Pills
        root.querySelectorAll('.vn-action-pill').forEach((btn) => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                if (action) {
                    this.store.sendChatMessage(action);
                    window.dispatchEvent(new CustomEvent('haven:user-action', { detail: { text: action } }));
                }
            });
        });
        // Dialogue Navigation
        const prevBtn = root.querySelector('#vn-prev-line');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                const state = this.store.getState();
                if (state.vn.currentLineIndex > 0) {
                    state.vn.currentLineIndex -= 1;
                    this.store.notify();
                }
            });
        }
        const nextBtn = root.querySelector('#vn-next-line');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const state = this.store.getState();
                if (state.vn.currentLineIndex < state.vn.dialogueHistory.length - 1) {
                    state.vn.currentLineIndex += 1;
                    this.store.notify();
                }
            });
        }
    }
}

/* --- combat.js --- */
/**
 * The Undercroft - Turn-based Dungeon RPG & Combat UI
 * Matches Screenshot 3 layout and features.
 */
class CombatComponent {
    store;
    constructor() {
        this.store = GameStore.get();
    }
    render() {
        const { combat } = this.store.getState();
        return `
      <div class="haven-combat-container">
        <!-- TOP DUNGEON HEADER -->
        <header class="haven-combat-header">
          <div class="dungeon-title-group">
            <span class="dungeon-skull-icon">💀</span>
            <div>
              <h2 class="dungeon-name">${combat.dungeonName}</h2>
              <span class="dungeon-zone">${combat.zoneName}</span>
            </div>
          </div>

          <!-- PARTY STATUS CARDS -->
          <div class="party-status-strip">
            ${combat.party.map((member) => this.renderPartyCard(member)).join('')}
          </div>
        </header>

        <!-- MAIN ARENA: Flooded Crypts, Enemies, and Speech Bubble -->
        <div class="haven-combat-arena">
          <div class="arena-background-scenery"></div>
          <div class="arena-mist-layer"></div>

          <!-- FLOATING IN-BATTLE SPEECH BANTER BUBBLE -->
          ${combat.speechBubble ? `
            <div class="combat-speech-bubble">
              <div class="speech-tail"></div>
              <span class="speech-speaker">${combat.speechBubble.speaker}:</span>
              <span class="speech-quote">"${combat.speechBubble.text}"</span>
            </div>
          ` : ''}

          <!-- MONSTER ENEMIES (Glowing Slimes) -->
          <div class="combat-enemies-group">
            ${combat.enemies.length > 0
            ? combat.enemies.map((enemy) => this.renderEnemyCard(enemy)).join('')
            : `
                <div class="combat-victory-banner">
                  <h3>⚔️ All Monsters Cleared!</h3>
                  <p>The waters settle. You may search for loot, rest by a campfire, or delve deeper.</p>
                </div>
              `}
          </div>
        </div>

        <!-- BOTTOM CONSOLE: Action Buttons & Live Combat Log -->
        <div class="haven-combat-console">
          <div class="combat-action-bar">
            <button 
              class="haven-btn haven-btn-combat-attack" 
              id="combat-btn-attack"
              ${combat.enemies.length === 0 ? 'disabled' : ''}
              title="Strike the nearest dungeon enemy"
            >
              <span class="btn-icon">⚔️</span>
              <span class="btn-label">Attack</span>
            </button>

            <button class="haven-btn haven-btn-combat-loot" id="combat-btn-loot" title="Scavenge dungeon for gold and relics">
              <span class="btn-icon">💰</span>
              <span class="btn-label">Loot Crypt</span>
            </button>

            <button class="haven-btn haven-btn-combat-rest" id="combat-btn-rest" title="Set up camp to restore HP & MP">
              <span class="btn-icon">🏕️</span>
              <span class="btn-label">Rest Party</span>
            </button>

            <button class="haven-btn haven-btn-combat-wave" id="combat-btn-wave" title="Spawn new monster wave">
              <span class="btn-icon">👾</span>
              <span class="btn-label">Next Wave</span>
            </button>

            <button class="haven-btn haven-btn-combat-retreat" id="combat-btn-retreat" title="Retreat to Haven House">
              <span class="btn-icon">🚪</span>
              <span class="btn-label">Turn Back</span>
            </button>
          </div>

          <!-- LIVE COMBAT ROLLING LOG -->
          <div class="combat-log-container">
            <div class="combat-log-title">BATTLE TELEMETRY</div>
            <div class="combat-log-scroll">
              ${combat.combatLog.map((log) => `
                <div class="combat-log-entry">
                  <span class="log-bullet">▸</span>
                  <span class="log-text">${log}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
    }
    renderPartyCard(member) {
        const hpPct = Math.round((member.hp / member.maxHp) * 100);
        const mpPct = Math.round((member.mp / member.maxMp) * 100);
        return `
      <div class="party-member-card">
        <img src="${member.avatar}" alt="${member.name}" class="party-avatar" />
        <div class="party-info">
          <div class="party-name-row">
            <span class="member-name">${member.name}</span>
            <span class="member-class">${member.classTitle}</span>
          </div>

          <!-- HP BAR -->
          <div class="gauge-wrapper hp-gauge">
            <div class="gauge-track">
              <div class="gauge-fill" style="width: ${hpPct}%;"></div>
            </div>
            <div class="gauge-numbers">HP ${member.hp}/${member.maxHp}</div>
          </div>

          <!-- MP BAR -->
          <div class="gauge-wrapper mp-gauge">
            <div class="gauge-track">
              <div class="gauge-fill" style="width: ${mpPct}%;"></div>
            </div>
            <div class="gauge-numbers">MP ${member.mp}/${member.maxMp}</div>
          </div>
        </div>
      </div>
    `;
    }
    renderEnemyCard(enemy) {
        const hpPct = Math.round((enemy.hp / enemy.maxHp) * 100);
        return `
      <div class="combat-enemy-unit" data-enemy-id="${enemy.id}">
        <div class="enemy-overhead">
          <div class="enemy-name">${enemy.name}</div>
          <div class="enemy-hp-bar">
            <div class="enemy-hp-fill" style="width: ${hpPct}%;"></div>
          </div>
          <span class="enemy-hp-text">${enemy.hp} / ${enemy.maxHp} HP</span>
        </div>

        <div class="enemy-sprite-glow"></div>
        <img src="${enemy.spriteUrl}" alt="${enemy.name}" class="enemy-sprite" />
      </div>
    `;
    }
    attachEvents(root) {
        // Attack Button
        const attackBtn = root.querySelector('#combat-btn-attack');
        if (attackBtn) {
            attackBtn.addEventListener('click', () => {
                const state = this.store.getState();
                if (state.combat.enemies.length > 0) {
                    const target = state.combat.enemies[0];
                    const damage = Math.floor(Math.random() * 8) + 6;
                    this.store.attackEnemy(target.id, damage);
                }
            });
        }
        // Direct enemy clicking to attack
        root.querySelectorAll('.combat-enemy-unit').forEach((el) => {
            el.addEventListener('click', () => {
                const enemyId = el.dataset.enemyId;
                if (enemyId) {
                    const damage = Math.floor(Math.random() * 8) + 6;
                    this.store.attackEnemy(enemyId, damage);
                }
            });
        });
        // Loot Button
        const lootBtn = root.querySelector('#combat-btn-loot');
        if (lootBtn) {
            lootBtn.addEventListener('click', () => {
                this.store.lootDungeon();
            });
        }
        // Rest Button
        const restBtn = root.querySelector('#combat-btn-rest');
        if (restBtn) {
            restBtn.addEventListener('click', () => {
                this.store.restDungeon();
            });
        }
        // Next Wave Button
        const waveBtn = root.querySelector('#combat-btn-wave');
        if (waveBtn) {
            waveBtn.addEventListener('click', () => {
                this.store.resetDungeon();
            });
        }
        // Retreat Button
        const retreatBtn = root.querySelector('#combat-btn-retreat');
        if (retreatBtn) {
            retreatBtn.addEventListener('click', () => {
                this.store.setViewMode('house');
            });
        }
    }
}

/* --- tablet.js --- */
/**
 * Bloomr Tablet OS - In-Game Simulated Social Network & AI Photo Feed UI
 * Matches Screenshot 4 layout and features.
 */
class TabletComponent {
    store;
    constructor() {
        this.store = GameStore.get();
    }
    render() {
        const { tablet } = this.store.getState();
        const activeTab = tablet.activeTab;
        return `
      <div class="haven-tablet-viewport">
        <!-- HARDWARE TABLET BEZEL -->
        <div class="tablet-frame">
          
          <!-- HARDWARE NOTCH / TOP BEZEL -->
          <div class="tablet-top-bezel">
            <div class="tablet-speaker-slot"></div>
            <div class="tablet-camera-lens"></div>
          </div>

          <!-- TABLET SCREEN -->
          <div class="tablet-screen">
            
            <!-- SYSTEM STATUS BAR -->
            <div class="tablet-status-bar">
              <div class="status-bar-left">
                <span class="status-time">10:42 AM</span>
                <span class="status-carrier">NordNet 5G</span>
              </div>
              <div class="status-bar-right">
                <span class="status-icon">📶</span>
                <span class="status-icon">⚡</span>
                <span class="status-battery">98%</span>
              </div>
            </div>

            <!-- BLOOMR APP HEADER -->
            <header class="bloomr-app-header">
              <div class="bloomr-brand-row">
                <div class="bloomr-logo">
                  <span class="bloomr-flower">🌸</span>
                  <span class="bloomr-text">bloomr</span>
                </div>
                <div class="bloomr-user-badge">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80" alt="Avatar" class="bloomr-self-avatar" />
                  <span class="bloomr-online-dot"></span>
                </div>
              </div>

              <!-- APP NAVIGATION TABS -->
              <nav class="bloomr-tabs-bar" role="tablist">
                <button class="bloomr-tab-btn ${activeTab === 'feed' ? 'active' : ''}" data-tab="feed">
                  <span class="tab-icon">📰</span>
                  <span>Feed</span>
                </button>
                <button class="bloomr-tab-btn ${activeTab === 'dms' ? 'active' : ''}" data-tab="dms">
                  <span class="tab-icon">💬</span>
                  <span>DMs</span>
                  <span class="bloomr-bubble-count">3</span>
                </button>
                <button class="bloomr-tab-btn ${activeTab === 'jobs' ? 'active' : ''}" data-tab="jobs">
                  <span class="tab-icon">💼</span>
                  <span>Shifts</span>
                </button>
                <button class="bloomr-tab-btn ${activeTab === 'stats' ? 'active' : ''}" data-tab="stats">
                  <span class="tab-icon">📊</span>
                  <span>Stats</span>
                </button>
              </nav>
            </header>

            <!-- TABLET CONTENT BODY -->
            <main class="bloomr-content-area">
              ${activeTab === 'feed' ? this.renderFeedTab(tablet.feed) : ''}
              ${activeTab === 'dms' ? this.renderDmsTab() : ''}
              ${activeTab === 'jobs' ? this.renderJobsTab() : ''}
              ${activeTab === 'stats' ? this.renderStatsTab() : ''}
            </main>

            <!-- HARDWARE HOME BAR -->
            <div class="tablet-home-indicator-bar">
              <div class="home-indicator-pill"></div>
            </div>

          </div>
        </div>
      </div>
    `;
    }
    renderFeedTab(feed) {
        return `
      <div class="bloomr-feed-view">
        <!-- COMPOSER BAR -->
        <div class="bloomr-composer-card">
          <div class="composer-top">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80" class="composer-avatar" alt="You" />
            <input 
              type="text" 
              id="bloomr-compose-input" 
              class="bloomr-compose-field" 
              placeholder="What's happening in Haven or campus?..." 
            />
          </div>
          <div class="composer-actions">
            <button class="composer-tool-btn" id="bloomr-btn-add-ai-art" title="Generate AI Photo with Pollinations Flux">
              🎨 <span>Attach AI Art</span>
            </button>
            <button class="haven-btn haven-btn-primary haven-btn-sm" id="bloomr-btn-post">
              Post ✦
            </button>
          </div>
        </div>

        <!-- POSTS STREAM -->
        <div class="bloomr-posts-stream">
          ${feed.map((post) => this.renderPostCard(post)).join('')}
        </div>
      </div>
    `;
    }
    renderPostCard(post) {
        return `
      <article class="bloomr-post-card" data-post-id="${post.id}">
        <!-- POST HEADER -->
        <div class="post-header">
          <img src="${post.authorAvatar}" alt="${post.authorName}" class="post-author-avatar" />
          <div class="post-author-meta">
            <div class="post-author-name-row">
              <span class="author-display-name">${post.authorName}</span>
              <span class="author-handle">${post.authorHandle}</span>
            </div>
            <span class="post-time">${post.timestamp}</span>
          </div>
          <button class="post-more-btn" title="Options">•••</button>
        </div>

        <!-- POST CONTENT & MENTIONS -->
        <div class="post-text-body">
          <p>${post.content}</p>
          ${post.mentions.length > 0
            ? `<div class="post-mentions-row">${post.mentions.map((m) => `<span class="mention-tag">${m}</span>`).join(' ')}</div>`
            : ''}
        </div>

        <!-- POST AI IMAGE ATTACHMENT -->
        ${post.imageUrl ? `
          <div class="post-media-frame">
            <img src="${post.imageUrl}" alt="Attachment" class="post-attached-image" loading="lazy" />
            <div class="post-ai-badge">✦ AI Generated (Pollinations Flux)</div>
          </div>
        ` : ''}

        <!-- POST ENGAGEMENT STATS -->
        <div class="post-engagement-bar">
          <button class="engagement-btn btn-like" data-post-id="${post.id}">
            <span class="eng-icon">❤️</span>
            <span class="eng-count">${post.likes}</span>
          </button>

          <button class="engagement-btn btn-comment-toggle" data-post-id="${post.id}">
            <span class="eng-icon">💬</span>
            <span class="eng-count">${post.comments.length}</span>
          </button>

          <button class="engagement-btn btn-share" title="Share link">
            <span class="eng-icon">🔁</span>
          </button>

          <button class="engagement-btn btn-ai-rephoto" data-post-id="${post.id}" title="Re-generate photo with Pollinations AI">
            <span class="eng-icon">✨</span>
            <span class="eng-count">Regen Art</span>
          </button>
        </div>

        <!-- COMMENTS LIST -->
        <div class="post-comments-section">
          ${post.comments.map((c) => `
            <div class="comment-item">
              <strong class="comment-author">${c.author}:</strong>
              <span class="comment-text">${c.text}</span>
              <span class="comment-time">${c.time}</span>
            </div>
          `).join('')}

          <!-- ADD COMMENT INPUT -->
          <div class="post-add-comment-row">
            <input 
              type="text" 
              class="bloomr-comment-field" 
              placeholder="Reply to ${post.authorName}..." 
              data-post-id="${post.id}"
            />
            <button class="btn-submit-comment" data-post-id="${post.id}">Reply</button>
          </div>
        </div>
      </article>
    `;
    }
    renderDmsTab() {
        const { tablet } = this.store.getState();
        const threads = tablet.dms;
        const activeThread = threads.find((t) => t.id === tablet.activeDmId) || threads[0];
        return `
      <div class="bloomr-dms-view">
        <!-- THREADS SIDEBAR -->
        <aside class="bloomr-dms-sidebar">
          <div class="dms-sidebar-header">Direct Messages</div>
          <div class="dms-thread-list">
            ${threads.map((t) => `
              <div class="dms-thread-item ${t.id === activeThread?.id ? 'active' : ''}" data-thread-id="${t.id}">
                <img src="${t.partnerAvatar}" alt="${t.partnerName}" class="dms-thread-avatar" />
                <div class="dms-thread-meta">
                  <div class="dms-thread-name">${t.partnerName}</div>
                  <div class="dms-thread-last">${t.messages[t.messages.length - 1]?.text || 'No messages'}</div>
                </div>
                ${t.unreadCount > 0 ? `<span class="dms-unread-pill">${t.unreadCount}</span>` : ''}
              </div>
            `).join('')}
          </div>
        </aside>

        <!-- CHAT CONVERSATION VIEW -->
        <section class="bloomr-dms-conversation">
          ${activeThread ? `
            <div class="conversation-header">
              <img src="${activeThread.partnerAvatar}" alt="${activeThread.partnerName}" class="chat-header-avatar" />
              <div>
                <h4 class="chat-header-name">${activeThread.partnerName}</h4>
                <span class="chat-header-status">Active now</span>
              </div>
            </div>

            <div class="conversation-messages-list">
              ${activeThread.messages.map((m) => `
                <div class="chat-bubble-row ${m.sender === 'me' ? 'sent' : 'received'}">
                  <div class="chat-bubble">
                    <p class="bubble-text">${m.text}</p>
                    <span class="bubble-time">${m.time}</span>
                  </div>
                </div>
              `).join('')}
            </div>

            <div class="conversation-input-row">
              <input 
                type="text" 
                id="bloomr-dm-field" 
                class="haven-input" 
                placeholder="Message ${activeThread.partnerName}..." 
                data-thread-id="${activeThread.id}"
              />
              <button class="haven-btn haven-btn-primary" id="bloomr-btn-send-dm" data-thread-id="${activeThread.id}">
                Send
              </button>
            </div>
          ` : `
            <div class="empty-dms-notice">Select a conversation to start messaging.</div>
          `}
        </section>
      </div>
    `;
    }
    renderJobsTab() {
        const { tablet } = this.store.getState();
        return `
      <div class="bloomr-jobs-view">
        <div class="jobs-hero-banner">
          <h3>Work Schedules & Campus Shifts</h3>
          <p>Earn gold for the Haven House rent ledger while balancing study hours.</p>
        </div>

        <div class="jobs-cards-grid">
          ${tablet.jobs.map((job) => `
            <div class="job-shift-card ${job.active ? 'is-active' : ''}">
              <div class="job-icon">💼</div>
              <div class="job-meta">
                <h4 class="job-title">${job.title}</h4>
                <div class="job-loc">📍 ${job.location}</div>
                <div class="job-wage">Wage: <strong class="text-gold">$${job.wage} / shift</strong></div>
              </div>
              <button class="haven-btn haven-btn-secondary job-work-btn" data-job-id="${job.id}">
                Complete Shift
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    }
    renderStatsTab() {
        const { tablet } = this.store.getState();
        const stats = tablet.stats;
        return `
      <div class="bloomr-stats-view">
        <div class="stats-hero-card">
          <div class="stats-hero-top">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" class="stats-hero-avatar" alt="Character" />
            <div>
              <h3>Mundi Explorer</h3>
              <p>Academy Scholar & Estate Steward</p>
            </div>
          </div>

          <div class="energy-gauge-group">
            <div class="energy-label-row">
              <span>Stamina / Energy</span>
              <span>${stats.energy} / ${stats.maxEnergy}</span>
            </div>
            <div class="gauge-track">
              <div class="gauge-fill energy-fill" style="width: ${(stats.energy / stats.maxEnergy) * 100}%;"></div>
            </div>
          </div>
        </div>

        <!-- ATTRIBUTES HEX / LIST -->
        <div class="attributes-grid">
          <div class="stat-attr-card"><span class="attr-name">STR (Strength)</span><span class="attr-val">${stats.str}</span></div>
          <div class="stat-attr-card"><span class="attr-name">DEX (Dexterity)</span><span class="attr-val">${stats.dex}</span></div>
          <div class="stat-attr-card"><span class="attr-name">END (Endurance)</span><span class="attr-val">${stats.end}</span></div>
          <div class="stat-attr-card"><span class="attr-name">INT (Intelligence)</span><span class="attr-val">${stats.int}</span></div>
          <div class="stat-attr-card"><span class="attr-name">CHA (Charisma)</span><span class="attr-val">${stats.cha}</span></div>
          <div class="stat-attr-card"><span class="attr-name">WIS (Wisdom)</span><span class="attr-val">${stats.wis}</span></div>
        </div>
      </div>
    `;
    }
    attachEvents(root) {
        // Tab switching
        root.querySelectorAll('.bloomr-tab-btn').forEach((btn) => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                if (tab) {
                    this.store.setTabletTab(tab);
                }
            });
        });
        // Likes
        root.querySelectorAll('.btn-like').forEach((btn) => {
            btn.addEventListener('click', () => {
                const postId = btn.dataset.postId;
                if (postId) {
                    this.store.likePost(postId);
                }
            });
        });
        // Add Comment
        root.querySelectorAll('.btn-submit-comment').forEach((btn) => {
            btn.addEventListener('click', () => {
                const postId = btn.dataset.postId;
                const input = root.querySelector(`.bloomr-comment-field[data-post-id="${postId}"]`);
                if (postId && input && input.value.trim()) {
                    this.store.addComment(postId, input.value.trim());
                    input.value = '';
                }
            });
        });
        // Post creation
        const postBtn = root.querySelector('#bloomr-btn-post');
        const postInput = root.querySelector('#bloomr-compose-input');
        if (postBtn && postInput) {
            postBtn.addEventListener('click', () => {
                const val = postInput.value.trim();
                if (val) {
                    this.store.createPost(val);
                    postInput.value = '';
                }
            });
        }
        // Attach AI Art button
        const aiArtBtn = root.querySelector('#bloomr-btn-add-ai-art');
        if (aiArtBtn && postInput) {
            aiArtBtn.addEventListener('click', () => {
                const userPrompt = window.prompt('Enter image prompt for Pollinations AI (Flux):', 'anime fantasy student reading arcane book in cozy library, warm cinematic lighting, high quality');
                if (userPrompt) {
                    const url = PollinationsClient.getImageUrl({ prompt: userPrompt, width: 720, height: 480 });
                    this.store.createPost(postInput.value.trim() || userPrompt, url);
                    postInput.value = '';
                }
            });
        }
        // Regen AI Art for existing post
        root.querySelectorAll('.btn-ai-rephoto').forEach((btn) => {
            btn.addEventListener('click', () => {
                const postId = btn.dataset.postId;
                const state = this.store.getState();
                const post = state.tablet.feed.find((p) => p.id === postId);
                if (post) {
                    const newUrl = PollinationsClient.getImageUrl({
                        prompt: post.content + ', ultra detailed cinematic photo',
                        seed: Math.floor(Math.random() * 999999),
                    });
                    post.imageUrl = newUrl;
                    this.store.notify();
                }
            });
        });
        // DM Send
        const dmSendBtn = root.querySelector('#bloomr-btn-send-dm');
        const dmField = root.querySelector('#bloomr-dm-field');
        if (dmSendBtn && dmField) {
            dmSendBtn.addEventListener('click', () => {
                const threadId = dmSendBtn.dataset.threadId;
                const text = dmField.value.trim();
                if (threadId && text) {
                    this.store.sendDM(threadId, text);
                    dmField.value = '';
                }
            });
        }
        // Thread select
        root.querySelectorAll('.dms-thread-item').forEach((item) => {
            item.addEventListener('click', () => {
                const threadId = item.dataset.threadId;
                if (threadId) {
                    this.store.getState().tablet.activeDmId = threadId;
                    this.store.notify();
                }
            });
        });
        // Job complete
        root.querySelectorAll('.job-work-btn').forEach((btn) => {
            btn.addEventListener('click', () => {
                const jobId = btn.dataset.jobId;
                const job = this.store.getState().tablet.jobs.find((j) => j.id === jobId);
                if (job) {
                    this.store.getState().estate.money += job.wage;
                    this.store.getState().estate.ledger.unshift({
                        id: `l_${Date.now()}`,
                        date: `Day ${this.store.getState().day}`,
                        desc: `Shift completed: ${job.title}`,
                        amount: job.wage,
                        type: 'income',
                    });
                    this.store.notify();
                    alert(`Completed shift at ${job.location}! Earned +$${job.wage}.`);
                }
            });
        });
    }
}

/* --- prompt.js --- */
/**
 * LLM Prompt Context Generator
 * Formats game world state into clean system instructions injected into SillyTavern.
 */
class PromptBuilder {
    static buildContext(state) {
        const estate = state.estate;
        const currentRoom = estate.rooms[estate.selectedRoomId] || estate.rooms.hearth;
        const vn = state.vn;
        const combat = state.combat;
        return `
[SYSTEM DIRECTIVE: HAVEN & BLOOMR ARCHETYPE STATE INJECTION]
World Clock: Day ${state.day} (${vn.weekday}, ${vn.dateStr}), ${vn.timeStr}
Current Mode: ${state.viewMode.toUpperCase()}

[ESTATE STATUS: ${estate.name}]
- Funds: $${estate.money} | Weekly Rent: $${estate.rent} (Due: ${estate.rentDueDate})
- Total Comfort: ${estate.comfort} | Built Chambers: ${Object.values(estate.rooms).filter(r => r.built).length}/11
- Active Room Inspected: ${currentRoom.name} (${currentRoom.floor} floor, Built: ${currentRoom.built}, Occupant: ${currentRoom.occupant || 'None'})
- Household Residents: ${estate.household.map(h => `${h.name} (${h.role})`).join(', ')}

[NORDHAVEN ACADEMY VISUAL NOVEL]
- Location: ${vn.locationTitle} (${vn.courseCode})
- Characters Present: ${vn.sprites.map(s => s.name).join(', ')}

[THE UNDERCROFT COMBAT STATUS]
- Dungeon: ${combat.dungeonName} - ${combat.zoneName}
- Party: ${combat.party.map(p => `${p.name} (HP: ${p.hp}/${p.maxHp}, MP: ${p.mp}/${p.maxMp})`).join(' | ')}
- Enemies Remaining: ${combat.enemies.map(e => `${e.name} (HP: ${e.hp}/${e.maxHp})`).join(' | ') || 'None (Cleared)'}

[BLOOMR TABLET OS]
- Latest Social Feed Post: "${state.tablet.feed[0]?.content || 'None'}" by ${state.tablet.feed[0]?.authorName || 'None'}
- Active Shift: ${state.tablet.currentShift}

Instructions for Assistant:
Stay fully in character. Acknowledge the player's surroundings and current game state seamlessly in dialogue and narrative roleplay.
`.trim();
    }
}

/* --- index.js --- */
/**
 * Haven - Life, Academy & Dungeon Extension Entry Point
 * Mounts UI layer, hooks into SillyTavern's native Extensions menu & settings panel.
 */
class HavenExtension {
    store;
    nav;
    house;
    vn;
    combat;
    tablet;
    rootEl = null;
    isVisible = true;
    constructor() {
        this.store = GameStore.get();
        this.nav = new NavComponent();
        this.house = new HouseComponent();
        this.vn = new VnComponent();
        this.combat = new CombatComponent();
        this.tablet = new TabletComponent();
    }
    init() {
        console.log('[Haven] Initializing Haven & Bloomr Archetype...');
        // Create or locate mount container
        let container = document.getElementById('haven-root');
        if (!container) {
            container = document.createElement('div');
            container.id = 'haven-root';
            container.className = 'haven-root-layer is-visible';
            document.body.appendChild(container);
        }
        this.rootEl = container;
        // Create floating trigger badge on SillyTavern
        this.createFloatingToggle();
        // Hook into SillyTavern's native Extensions menu and settings panel
        this.hookSillyTavernIntegrations();
        // Subscribe to state updates
        this.store.subscribe(() => this.render());
        // Listen to custom events
        this.bindGlobalEvents();
        // Initial render
        this.render();
        console.log('[Haven] Ready.');
    }
    setVisible(visible) {
        this.isVisible = visible;
        if (this.rootEl) {
            this.rootEl.classList.toggle('is-visible', this.isVisible);
        }
        const chk = document.querySelector('#haven-enabled-toggle');
        if (chk && chk.checked !== this.isVisible) {
            chk.checked = this.isVisible;
        }
    }
    toggleVisibility() {
        this.setVisible(!this.isVisible);
    }
    createFloatingToggle() {
        if (document.getElementById('haven-floating-toggle'))
            return;
        const toggle = document.createElement('button');
        toggle.id = 'haven-floating-toggle';
        toggle.className = 'haven-floating-launcher';
        toggle.innerHTML = '✦ Haven OS';
        toggle.title = 'Toggle Haven Game Interface (Alt + M)';
        toggle.addEventListener('click', () => {
            this.toggleVisibility();
        });
        document.body.appendChild(toggle);
        // Keyboard shortcut
        window.addEventListener('keydown', (e) => {
            if (e.altKey && (e.key === 'm' || e.key === 'M')) {
                this.toggleVisibility();
            }
        });
    }
    /**
     * Hooks into SillyTavern's native #extensionsMenu (Cube icon) and
     * #extensions_settings / #extensions_settings2 (Extensions Drawer).
     */
    hookSillyTavernIntegrations() {
        const tryInject = () => {
            this.addLauncherItem();
            this.addSettingsBlock();
        };
        // Run immediately
        tryInject();
        // Poll periodically to catch SillyTavern DOM construction
        let attempts = 0;
        const interval = setInterval(() => {
            attempts++;
            tryInject();
            if (attempts > 30)
                clearInterval(interval);
        }, 1000);
        // Also listen to click on extensions button in SillyTavern
        document.addEventListener('click', (e) => {
            const target = e.target;
            if (target && (target.closest('#extensions_button') || target.closest('#rm_button_extensions'))) {
                setTimeout(tryInject, 100);
            }
        });
        // SillyTavern event hook if available
        try {
            const stContext = window.SillyTavern?.getContext?.();
            if (stContext?.eventSource && stContext?.eventTypes) {
                stContext.eventSource.on(stContext.eventTypes.APP_READY, () => {
                    tryInject();
                });
            }
        }
        catch {
            // Ignore
        }
    }
    /**
     * Injects Haven into SillyTavern's #extensionsMenu dropdown
     */
    addLauncherItem() {
        const menu = document.getElementById('extensionsMenu');
        if (menu && !document.getElementById('haven-launch')) {
            const item = document.createElement('div');
            item.id = 'haven-launch';
            item.className = 'list-group-item flex-container flexGap5';
            item.style.cursor = 'pointer';
            item.innerHTML = '<div class="fa-solid fa-hotel extensionsMenuExtensionButton"></div><span>Haven & Bloomr</span>';
            item.addEventListener('click', () => {
                this.setVisible(true);
            });
            menu.appendChild(item);
        }
    }
    /**
     * Injects Haven settings block into SillyTavern's #extensions_settings
     */
    addSettingsBlock() {
        const host = document.getElementById('extensions_settings') ?? document.getElementById('extensions_settings2');
        if (!host || document.getElementById('haven-settings-block'))
            return;
        const box = document.createElement('div');
        box.id = 'haven-settings-block';
        box.className = 'extension_container';
        box.innerHTML = `
      <div class="inline-drawer">
        <div class="inline-drawer-toggle inline-drawer-header">
          <b>Haven & Bloomr</b>
          <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
        </div>
        <div class="inline-drawer-content" style="padding: 10px 14px;">
          <div class="flex-container flexGap5" style="margin: 6px 0 10px 0;">
            <div id="haven-open-btn" class="menu_button menu_button_icon" style="cursor: pointer; display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; background: #4f46e5; color: #fff; border-radius: 6px;">
              <i class="fa-solid fa-hotel"></i>
              <span>Mở giao diện Haven</span>
            </div>
          </div>
          <label class="checkbox_label" for="haven-enabled-toggle" style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
            <input id="haven-enabled-toggle" type="checkbox" checked />
            <span>Kích hoạt Haven UI (Hiển thị giao diện)</span>
          </label>
          <div style="font-size: 11px; opacity: 0.75; margin-top: 8px;">
            💡 Phím tắt nhanh: <code>Alt + M</code> hoặc click nút nổi <b>✦ Haven OS</b> góc phải màn hình.
          </div>
        </div>
      </div>
    `;
        host.appendChild(box);
        const toggleHeader = box.querySelector('.inline-drawer-toggle');
        const content = box.querySelector('.inline-drawer-content');
        const icon = box.querySelector('.inline-drawer-icon');
        if (toggleHeader && content) {
            toggleHeader.addEventListener('click', () => {
                const isHidden = content.style.display === 'none';
                content.style.display = isHidden ? 'block' : 'none';
                if (icon) {
                    icon.classList.toggle('down', isHidden);
                    icon.classList.toggle('up', !isHidden);
                }
            });
        }
        const openBtn = box.querySelector('#haven-open-btn');
        if (openBtn) {
            openBtn.addEventListener('click', () => {
                this.setVisible(true);
            });
        }
        const chk = box.querySelector('#haven-enabled-toggle');
        if (chk) {
            chk.addEventListener('change', () => {
                this.setVisible(chk.checked);
            });
        }
    }
    render() {
        if (!this.rootEl)
            return;
        const state = this.store.getState();
        const mode = state.viewMode;
        let contentHtml = '';
        switch (mode) {
            case 'house':
                contentHtml = this.house.render();
                break;
            case 'vn':
                contentHtml = this.vn.render();
                break;
            case 'combat':
                contentHtml = this.combat.render();
                break;
            case 'tablet':
                contentHtml = this.tablet.render();
                break;
        }
        this.rootEl.innerHTML = `
      <div class="haven-app-wrapper">
        ${this.nav.render()}
        <div class="haven-viewport-content">
          ${contentHtml}
        </div>
      </div>
    `;
        // Attach events for nav and active view
        this.nav.attachEvents(this.rootEl);
        switch (mode) {
            case 'house':
                this.house.attachEvents(this.rootEl);
                break;
            case 'vn':
                this.vn.attachEvents(this.rootEl);
                break;
            case 'combat':
                this.combat.attachEvents(this.rootEl);
                break;
            case 'tablet':
                this.tablet.attachEvents(this.rootEl);
                break;
        }
    }
    bindGlobalEvents() {
        // When user types in VN prompt or triggers an action
        window.addEventListener('haven:user-action', (e) => {
            const customEvent = e;
            const text = customEvent.detail?.text;
            if (!text)
                return;
            // Try SillyTavern text input
            const stInput = document.querySelector('#send_textarea');
            const stSendBtn = document.querySelector('#send_but');
            if (stInput && stSendBtn) {
                stInput.value = text;
                stInput.dispatchEvent(new Event('input', { bubbles: true }));
                stSendBtn.click();
            }
            else {
                // Fallback simulated response
                setTimeout(() => {
                    this.store.addVnLine('Elowen Frost', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80', `I heard your point about "${text}". That certainly shifts our perspective on this topic.`);
                }, 800);
            }
        });
        // When LLM sync requested
        window.addEventListener('haven:sync-prompt', () => {
            const context = PromptBuilder.buildContext(this.store.getState());
            console.log('[Haven Context Injected]:\n', context);
            // Attempt SillyTavern clipboard or alert
            if (navigator.clipboard) {
                navigator.clipboard.writeText(context);
                alert('Haven game context copied to clipboard! (Ready for injection or prompt template)');
            }
            else {
                alert('Game context synced successfully!');
            }
        });
    }
}
// Auto-initialize when DOM ready or SillyTavern extensions loaded
function boot() {
    const app = new HavenExtension();
    app.init();
    window.haven = app;
    window.Haven = app;
    window.Mundi = app;
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
}
else {
    boot();
}

export default HavenExtension;
