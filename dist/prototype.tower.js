"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
StructureTower.prototype.defend = function () {
    // First, check for hostile creeps
    const target = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (target) {
        this.attack(target);
        return;
    }
    // If no hostiles, repair structures
    if (this.store.energy > 0) {
        // Find damaged structures
        const structures = this.room.find(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax &&
                structure.structureType !== STRUCTURE_WALL &&
                structure.structureType !== STRUCTURE_RAMPART
        });
        // Sort structures by damage percentage
        structures.sort((a, b) => (a.hits / a.hitsMax) - (b.hits / b.hitsMax));
        if (structures.length > 0) {
            this.repair(structures[0]);
        }
    }
};
//# sourceMappingURL=prototype.tower.js.map