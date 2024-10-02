"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const role_builder_1 = require("./role.builder");
function run(creep) {
    if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
        creep.memory.working = false;
    }
    else if (!creep.memory.working && creep.store.getFreeCapacity() == 0) {
        creep.memory.working = true;
    }
    if (creep.memory.working) {
        const structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL,
        });
        if (structure) {
            if (creep.repair(structure) == ERR_NOT_IN_RANGE) {
                creep.moveTo(structure);
            }
        }
        else {
            // If no structures need repairing, run builder logic
            (0, role_builder_1.run)(creep);
        }
    }
    else {
        creep.getEnergy(true, true);
    }
}
exports.run = run;
//# sourceMappingURL=role.repairer.js.map