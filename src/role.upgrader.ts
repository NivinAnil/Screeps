export function run(creep: Creep): void {
    if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
        creep.memory.working = false;
    }
    else if (!creep.memory.working && creep.store.getFreeCapacity() == 0) {
        creep.memory.working = true;
    }

    if (creep.memory.working) {
        if (creep.upgradeController(creep.room.controller!) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller!);
        }
    }
    else {
        // Try to get energy from containers first
        const container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) => s.structureType == STRUCTURE_CONTAINER &&
                           s.store[RESOURCE_ENERGY] > creep.store.getFreeCapacity()
        });

        if (container) {
            if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(container);
            }
        } else {
            // If no containers with energy, fall back to default getEnergy method
            creep.getEnergy(true, true);
        }
    }
}