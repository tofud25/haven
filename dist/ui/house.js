"use strict";
/**
 * Haven House - Dollhouse Cross-Section Estate Management UI
 * Matches Screenshot 1 layout and features.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.HouseComponent = void 0;
const state_js_1 = require("../state.js");
class HouseComponent {
    store;
    constructor() {
        this.store = state_js_1.GameStore.get();
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
exports.HouseComponent = HouseComponent;
