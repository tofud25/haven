/**
 * Haven - Life, Academy & Dungeon Extension Entry Point
 * Mounts UI layer, hooks into SillyTavern's native Extensions menu & settings panel.
 */
import { GameStore } from './state.js';
import { NavComponent } from './ui/nav.js';
import { HouseComponent } from './ui/house.js';
import { VnComponent } from './ui/vn.js';
import { CombatComponent } from './ui/combat.js';
import { TabletComponent } from './ui/tablet.js';
import { PromptBuilder } from './llm/prompt.js';
export class HavenExtension {
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
