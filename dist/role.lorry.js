"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
function run(creep) {
    console.log(`Lorry ${creep.name} is running. Working: ${creep.memory.working}`);
    if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
        creep.memory.working = false;
        console.log(`Lorry ${creep.name} is now collecting`);
    }
    else if (!creep.memory.working && creep.store.getFreeCapacity() == 0) {
        creep.memory.working = true;
        console.log(`Lorry ${creep.name} is now delivering`);
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
        if (structure) {
            if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                let moveResult = creep.moveTo(structure);
                console.log(`Lorry ${creep.name} move result: ${moveResult}`);
            }
            console.log(`Lorry ${creep.name} is trying to deliver to: ${structure === null || structure === void 0 ? void 0 : structure.pos}`);
        }
    }
    else {
        let container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: s => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0
        });
        if (container == null) {
            container = creep.room.storage || null;
        }
        if (container) {
            if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                let moveResult = creep.moveTo(container);
                console.log(`Lorry ${creep.name} move result: ${moveResult}`);
            }
            console.log(`Lorry ${creep.name} is trying to collect from: ${container === null || container === void 0 ? void 0 : container.pos}`);
        }
    }
}
exports.run = run;
//# sourceMappingURL=role.lorry.js.map