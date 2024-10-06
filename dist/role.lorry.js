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
        // Delivery logic
        // First, check if spawns, extensions, or towers need energy
        let target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
            filter: (s) => (s.structureType == STRUCTURE_SPAWN ||
                s.structureType == STRUCTURE_EXTENSION ||
                s.structureType == STRUCTURE_TOWER) &&
                s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        });
        // If no spawns, extensions, or towers need energy, then deliver to containers
        if (!target) {
            target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => s.structureType == STRUCTURE_CONTAINER &&
                    s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            });
        }
        if (target) {
            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
            console.log(`Lorry ${creep.name} is delivering to ${target.structureType} at: ${target.pos}`);
        }
        else {
            console.log(`Lorry ${creep.name} couldn't find any structure to deliver energy to`);
            // Optionally, move to an idle spot
            const idleFlag = Game.flags['LorryIdleSpot'];
            if (idleFlag) {
                creep.moveTo(idleFlag);
            }
        }
    }
    else {
        // Collection logic - prioritize dropped resources near miners
        const droppedResources = creep.room.find(FIND_DROPPED_RESOURCES, {
            filter: (r) => r.resourceType == RESOURCE_ENERGY
        });
        if (droppedResources.length > 0) {
            // Find miners
            const miners = creep.room.find(FIND_MY_CREEPS, {
                filter: (c) => c.memory.role == 'miner'
            });
            // Find dropped resources near miners
            let nearestDroppedResource = null;
            let shortestDistance = Infinity;
            for (let resource of droppedResources) {
                for (let miner of miners) {
                    const distance = resource.pos.getRangeTo(miner.pos);
                    if (distance < shortestDistance) {
                        shortestDistance = distance;
                        nearestDroppedResource = resource;
                    }
                }
            }
            if (nearestDroppedResource) {
                if (creep.pickup(nearestDroppedResource) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(nearestDroppedResource);
                }
                console.log(`Lorry ${creep.name} is collecting dropped resource at: ${nearestDroppedResource.pos}`);
                return;
            }
        }
        // If no dropped resources near miners, check containers
        const container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) => s.structureType == STRUCTURE_CONTAINER &&
                s.store[RESOURCE_ENERGY] > 0
        });
        if (container) {
            if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(container);
            }
            console.log(`Lorry ${creep.name} is withdrawing from container at: ${container.pos}`);
        }
        else {
            console.log(`Lorry ${creep.name} couldn't find any energy to collect`);
        }
    }
}
exports.run = run;
//# sourceMappingURL=role.lorry.js.map