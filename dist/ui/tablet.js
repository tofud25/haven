/**
 * Bloomr Tablet OS - In-Game Simulated Social Network & AI Photo Feed UI
 * Matches Screenshot 4 layout and features.
 */
import { GameStore } from '../state.js';
import { PollinationsClient } from '../api/pollinations.js';
export class TabletComponent {
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
