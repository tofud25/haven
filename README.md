# Haven: Life, Academy & Dungeon Archetype (v2.0)

A comprehensive SillyTavern extension that recreates 4 modular game systems:
1. **🏰 Haven House**: Architectural cutaway dollhouse cross-section room builder, estate financial ledger (rent, comfort, resident tags, room construction).
2. **🎓 Nordhaven Academy Visual Novel**: High-resolution anime/gothic layered character sprites (Elowen Frost & Morgause Vane), dynamic world calendar/clock, typewriter dialogue box, and interactive prompt bar.
3. **⚔️ The Undercroft**: Turn-based RPG dungeon crawler, party status monitors (HP/MP gauges), glowing slime monsters, real-time battle telemetry log, and action controls (`Attack`, `Loot`, `Rest`, `Next Wave`, `Turn Back`).
4. **📱 Bloomr Tablet OS**: Simulated futuristic in-game tablet OS with social media feed, direct messages (DMs), student work shifts/jobs, character attribute sheet (STR, DEX, INT, Energy), and free real-time AI image generation powered by Pollinations Flux/SDXL.

---

## 🌟 Key Features

### 1. Estate Management (Haven House)
- Interactive 4-floor cross-section:
  - **Roof & Attic**: The attic room
  - **2nd Floor**: The master bedroom, The bathroom, The west bedroom, The east bedroom
  - **Ground Floor**: The hearth room, The family room, The garden
  - **Basement**: The study, The nanny's room, The nursery
- Live cash ledger tracking weekly rent ($800/wk), construction expenses, and dungeon earnings.
- Chamber inspection drawer with one-click construction and resident assignments.

### 2. Visual Novel Stage (Nordhaven Academy)
- High-fidelity visual novel presentation with layered character sprites.
- Typewriter dialogue box with speaker accents, backlog history, auto-advance, and previous/next dialogue traversal.
- Quick action pills for instantaneous roleplay responses.
- Injects full world state into SillyTavern LLMs (LiteRouter, GLM-5.3-flash, Claude, OpenAI, etc.).

### 3. The Undercroft (Turn-based RPG)
- Flooded crypts arena with bioluminescent atmospheric effects.
- Dynamic party HP/MP tracking and monster combat mechanics.
- In-battle party banter bubbles and live combat telemetry log.

### 4. Bloomr Tablet OS
- Realistic tablet hardware frame with notch, battery indicator, and carrier status.
- Social feed with user avatars, post timestamps, tagged handles, likes, and comment threads.
- Zero-configuration AI photo generator: Click `Attach AI Art` or `Regen Art` to produce instant Flux/SDXL images for posts at zero cost and without API keys.
- Direct messaging (DMs) with classmates and residents.
- Work shifts for earning gold and character stats dashboard.

---

## 🚀 Installation in SillyTavern

### Method 1: Install via Extension Manager
1. In SillyTavern, open **Extensions** (cube icon) -> **Install Extension**.
2. Paste the git repository URL:
   ```
   https://github.com/tofud25/haven.git
   ```
3. Click **Install**. Once installed, reload SillyTavern.

### Method 2: Manual Clone
Clone directly into SillyTavern's `public/scripts/extensions/third-party/` folder:
```bash
cd SillyTavern/public/scripts/extensions/third-party
git clone https://github.com/tofud25/haven.git
```

---

## 🎮 Controls & Shortcuts

| Action | Shortcut / Control |
|---|---|
| Toggle Mundi OS Overlay | `Alt + M` or click the floating `✦ Mundi OS` button |
| Switch Game View | Click tabs in the top navigation bar (Haven House, Academy VN, Undercroft, Bloomr OS) |
| Advance Clock | Click `⏩ +1h` in the top right HUD |
| Sync LLM Context | Click `🔄 LLM Sync` to copy system directives for LiteRouter / GLM-5.3-flash |

---

## 🛠️ Architecture & Tech Stack
- **TypeScript**: Strictly typed state management and modular UI components (`src/`).
- **Vanilla CSS3**: Tailored dark-mode glassmorphic design system (`css/` -> `style.css`).
- **Pollinations AI**: Instant Flux & SDXL image generation without external API keys.
- **LocalStorage**: Persistent estate and character progress across sessions.

---

## 📜 License
MIT
