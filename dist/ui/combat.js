/**
 * The Undercroft - Turn-based Dungeon RPG & Combat UI
 * Matches Screenshot 3 layout and features.
 */
import { GameStore } from '../state.js';
export class CombatComponent {
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
