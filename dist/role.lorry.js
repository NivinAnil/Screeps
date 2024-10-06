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
        // Delivery logic - prioritize containers near sources
        const containers = creep.room.find(FIND_STRUCTURES, {
            filter: (s) => s.structureType == STRUCTURE_CONTAINER &&
                s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        });
        let target = creep.pos.findClosestByPath(containers);
        // If no containers or they're full, deliver to spawns, extensions, or towers
        if (!target) {
            target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (s) => (s.structureType == STRUCTURE_SPAWN ||
                    s.structureType == STRUCTURE_EXTENSION ||
                    s.structureType == STRUCTURE_TOWER) &&
                    s.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
            });
        }
        // If everything else is full, deliver to storage
        if (!target && creep.room.storage) {
            target = creep.room.storage;
        }
        if (target) {
            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                let moveResult = creep.moveTo(target);
                console.log(`Lorry ${creep.name} move result: ${moveResult}`);
            }
            console.log(`Lorry ${creep.name} is trying to deliver to: ${target.pos}`);
        }
    }
    else {
        // Collection logic - prioritize miner drops
        const droppedResources = creep.room.find(FIND_DROPPED_RESOURCES, {
            filter: (r) => r.resourceType == RESOURCE_ENERGY
        });
        if (droppedResources.length > 0) {
            const target = creep.pos.findClosestByPath(droppedResources);
            if (target) {
                if (creep.pickup(target) == ERR_NOT_IN_RANGE) {
                    let moveResult = creep.moveTo(target);
                    console.log(`Lorry ${creep.name} move result to dropped resource: ${moveResult}`);
                }
                console.log(`Lorry ${creep.name} is trying to collect dropped resource at: ${target.pos}`);
                return;
            }
        }
        // If no dropped resources, check containers and storage
        let container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) => (s.structureType == STRUCTURE_CONTAINER ||
                s.structureType == STRUCTURE_STORAGE) &&
                s.store[RESOURCE_ENERGY] > creep.store.getFreeCapacity()
        });
        if (container) {
            if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                let moveResult = creep.moveTo(container);
                console.log(`Lorry ${creep.name} move result to container: ${moveResult}`);
            }
            console.log(`Lorry ${creep.name} is trying to collect from container at: ${container.pos}`);
        }
        else {
            console.log(`Lorry ${creep.name} couldn't find any energy to collect`);
        }
    }
}
exports.run = run;
//# sourceMappingURL=role.lorry.js.map