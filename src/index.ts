/**
 * Mundi - Haven & Bloomr Extension Entry Point
 * Orchestrates UI mounting, reactive re-rendering, and SillyTavern integration.
 */

import { GameStore } from './state.js';
import { NavComponent } from './ui/nav.js';
import { HouseComponent } from './ui/house.js';
import { VnComponent } from './ui/vn.js';
import { CombatComponent } from './ui/combat.js';
import { TabletComponent } from './ui/tablet.js';
import { PromptBuilder } from './llm/prompt.js';

class MundiExtension {
  private store: GameStore;
  private nav: NavComponent;
  private house: HouseComponent;
  private vn: VnComponent;
  private combat: CombatComponent;
  private tablet: TabletComponent;
  private rootEl: HTMLElement | null = null;
  private isVisible = true;

  constructor() {
    this.store = GameStore.get();
    this.nav = new NavComponent();
    this.house = new HouseComponent();
    this.vn = new VnComponent();
    this.combat = new CombatComponent();
    this.tablet = new TabletComponent();
  }

  public init(): void {
    console.log('[Mundi] Initializing Haven & Bloomr Archetype...');

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

    // Subscribe to state updates
    this.store.subscribe(() => this.render());

    // Listen to custom events
    this.bindGlobalEvents();

    // Initial render
    this.render();

    console.log('[Mundi] Ready.');
  }

  private createFloatingToggle(): void {
    if (document.getElementById('haven-floating-toggle')) return;

    const toggle = document.createElement('button');
    toggle.id = 'haven-floating-toggle';
    toggle.className = 'haven-floating-launcher';
    toggle.innerHTML = '✦ Mundi OS';
    toggle.title = 'Toggle Mundi Game Interface (Alt + M)';

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

  public toggleVisibility(): void {
    this.isVisible = !this.isVisible;
    if (this.rootEl) {
      this.rootEl.classList.toggle('is-visible', this.isVisible);
    }
  }

  public render(): void {
    if (!this.rootEl) return;

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

  private bindGlobalEvents(): void {
    // When user types in VN prompt or triggers an action
    window.addEventListener('haven:user-action', (e: Event) => {
      const customEvent = e as CustomEvent<{ text: string }>;
      const text = customEvent.detail?.text;
      if (!text) return;

      // Try SillyTavern text input
      const stInput = document.querySelector<HTMLTextAreaElement>('#send_textarea');
      const stSendBtn = document.querySelector<HTMLButtonElement>('#send_but');

      if (stInput && stSendBtn) {
        stInput.value = text;
        stInput.dispatchEvent(new Event('input', { bubbles: true }));
        stSendBtn.click();
      } else {
        // Fallback simulated response
        setTimeout(() => {
          this.store.addVnLine(
            'Elowen Frost',
            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
            `I heard your point about "${text}". That certainly shifts our perspective on this topic.`
          );
        }, 800);
      }
    });

    // When LLM sync requested
    window.addEventListener('haven:sync-prompt', () => {
      const context = PromptBuilder.buildContext(this.store.getState());
      console.log('[Mundi Context Injected]:\n', context);

      // Attempt SillyTavern clipboard or alert
      if (navigator.clipboard) {
        navigator.clipboard.writeText(context);
        alert('Mundi game context copied to clipboard! (Ready for injection or prompt template)');
      } else {
        alert('Game context synced successfully!');
      }
    });
  }
}

// Auto-initialize when DOM ready or SillyTavern extensions loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const app = new MundiExtension();
    app.init();
    (window as any).havenMundi = app;
  });
} else {
  const app = new MundiExtension();
  app.init();
  (window as any).havenMundi = app;
}
