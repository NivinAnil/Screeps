"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
function run(creep) {
    if (creep.store.getFreeCapacity() > 0) {
        const mineral = creep.room.find(FIND_MINERALS)[0];
        if (creep.harvest(mineral) == ERR_NOT_IN_RANGE) {
            creep.moveTo(mineral);
        }
    }
    else {
        const storage = creep.room.storage;
        if (storage && creep.transfer(storage, Object.keys(creep.store)[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(storage);
        }
    }
}
exports.run = run;
//# sourceMappingURL=role.mineralHarvester.js.map