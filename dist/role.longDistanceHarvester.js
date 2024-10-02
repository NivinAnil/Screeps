export function run(creep) {
    if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
        creep.memory.working = false;
    }
    else if (!creep.memory.working && creep.store.getFreeCapacity() == 0) {
        creep.memory.working = true;
    }
    if (creep.memory.working) {
        if (creep.room.name == creep.memory.home) {
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
                    creep.moveTo(structure);
                }
            }
        }
        else {
            const exit = creep.room.findExitTo(creep.memory.home);
            if (exit !== ERR_NO_PATH && exit !== ERR_INVALID_ARGS) {
                const exitPos = creep.pos.findClosestByRange(exit);
                if (exitPos) {
                    creep.moveTo(exitPos);
                }
            }
        }
    }
    else {
        if (creep.room.name == creep.memory.target) {
            const sources = creep.room.find(FIND_SOURCES);
            if (creep.memory.sourceIndex !== undefined && sources[creep.memory.sourceIndex]) {
                if (creep.harvest(sources[creep.memory.sourceIndex]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[creep.memory.sourceIndex]);
                }
            }
        }
        else {
            const exit = creep.room.findExitTo(creep.memory.target);
            if (exit !== ERR_NO_PATH && exit !== ERR_INVALID_ARGS) {
                const exitPos = creep.pos.findClosestByRange(exit);
                if (exitPos) {
                    creep.moveTo(exitPos);
                }
            }
        }
    }
}
//# sourceMappingURL=role.longDistanceHarvester.js.map