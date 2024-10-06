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
            filter: (s) => (s.structureType == STRUCTURE_SPAWN ||
                s.structureType == STRUCTURE_EXTENSION ||
                s.structureType == STRUCTURE_TOWER) &&
                s.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
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
        // First, check containers and storage
        let container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) => (s.structureType == STRUCTURE_CONTAINER ||
                s.structureType == STRUCTURE_STORAGE) &&
                s.store[RESOURCE_ENERGY] > 0,
        });
        if (container) {
            if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                let moveResult = creep.moveTo(container);
                console.log(`Lorry ${creep.name} move result: ${moveResult}`);
            }
            console.log(`Lorry ${creep.name} is trying to collect from container at: ${container === null || container === void 0 ? void 0 : container.pos}`);
        }
        else {
            // If no containers or storage with energy, look for dropped resources
            const droppedResource = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
                filter: resource => resource.resourceType == RESOURCE_ENERGY
            });
            if (droppedResource) {
                if (creep.pickup(droppedResource) == ERR_NOT_IN_RANGE) {
                    let moveResult = creep.moveTo(droppedResource);
                    console.log(`Lorry ${creep.name} moving to dropped resource. Result: ${moveResult}`);
                }
                console.log(`Lorry ${creep.name} is trying to pick up dropped resource at: ${droppedResource.pos}`);
            }
            else {
                console.log(`Lorry ${creep.name} couldn't find any energy to collect`);
            }
        }
    }
}
exports.run = run;
//# sourceMappingURL=role.lorry.js.map