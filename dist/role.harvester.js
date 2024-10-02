"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
function run(creep) {
    if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
        creep.memory.working = false;
    }
    else if (!creep.memory.working && creep.store.getFreeCapacity() == 0) {
        creep.memory.working = true;
    }
    if (creep.memory.working) {
        let structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
            filter: (s) => (s.structureType == STRUCTURE_SPAWN
                || s.structureType == STRUCTURE_EXTENSION
                || s.structureType == STRUCTURE_TOWER)
                && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        });
        if (structure == null) {
            structure = creep.room.storage || null;
        }
        if (structure != null) {
            if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(structure);
            }
        }
    }
    else {
        creep.getEnergy(false, true);
    }
}
exports.run = run;
//# sourceMappingURL=role.harvester.js.map