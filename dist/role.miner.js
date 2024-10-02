"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
function run(creep) {
    const source = Game.getObjectById(creep.memory.sourceId);
    if (source) {
        const container = source.pos.findInRange(FIND_STRUCTURES, 1, {
            filter: s => s.structureType == STRUCTURE_CONTAINER
        })[0];
        if (container) {
            if (creep.pos.isEqualTo(container.pos)) {
                creep.harvest(source);
            }
            else {
                creep.moveTo(container);
            }
        }
        else {
            // If no container is found, move to the source and harvest
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
    }
    else {
        // If the source is not found, log an error or handle appropriately
        console.log(`Miner ${creep.name} couldn't find its assigned source`);
    }
}
exports.run = run;
//# sourceMappingURL=role.miner.js.map