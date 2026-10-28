/**
 * Global Top Navigation Bar for Haven & Bloomr
 */

import { GameStore } from '../state.js';
import { ViewMode } from '../types.js';

export class NavComponent {
  private store: GameStore;

  constructor() {
    this.store = GameStore.get();
  }

  public render(): string {
    const state = this.store.getState();
    const active = state.viewMode;

    return `
      <header class="haven-nav-header">
        <div class="haven-nav-left">
          <div class="haven-brand">
            <span class="haven-brand-gem">✦</span>
            <span class="haven-brand-title">MUNDI</span>
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

  public attachEvents(root: HTMLElement): void {
    root.querySelectorAll<HTMLButtonElement>('.haven-nav-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.mode as ViewMode;
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
