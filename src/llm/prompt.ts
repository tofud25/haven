/**
 * LLM Prompt Context Generator
 * Formats game world state into clean system instructions injected into SillyTavern.
 */

import { HavenGameState } from '../types.js';

export class PromptBuilder {
  public static buildContext(state: HavenGameState): string {
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
