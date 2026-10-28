/**
 * Nordhaven Academy Visual Novel UI
 * Matches Screenshot 2 layout and features.
 */
import { GameStore } from '../state.js';
export class VnComponent {
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
