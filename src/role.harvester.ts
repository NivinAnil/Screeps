export function run(creep: Creep): void {
  if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
    creep.memory.working = false;
  } else if (!creep.memory.working && creep.store.getFreeCapacity() == 0) {
    creep.memory.working = true;
  }

  if (creep.memory.working) {
    // Delivery logic
    let target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
      filter: (s) =>
        (s.structureType == STRUCTURE_SPAWN ||
          s.structureType == STRUCTURE_EXTENSION ||
          s.structureType == STRUCTURE_TOWER) &&
        s.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
    });

    if (target) {
      if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveToEfficiently(target);
      }
    } else {
      // If no primary targets, try to transfer to storage
      if (
        creep.room.storage &&
        creep.room.storage.store.getFreeCapacity(RESOURCE_ENERGY) > 0
      ) {
        if (
          creep.transfer(creep.room.storage, RESOURCE_ENERGY) ==
          ERR_NOT_IN_RANGE
        ) {
          creep.moveToEfficiently(creep.room.storage);
        }
      } else {
        // If no storage or it's full, try to transfer to containers
        let container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
          filter: (s) =>
            s.structureType == STRUCTURE_CONTAINER &&
            s.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
        });
        if (container) {
          if (creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveToEfficiently(container);
          }
        } else {
          // If nowhere to put energy, move to a central flag or idle
          const idleFlag = Game.flags["IdleSpot"];
          if (idleFlag) {
            creep.moveToEfficiently(idleFlag);
          }
        }
      }
    }
  } else {
    // Collection logic - prioritize dropped resources
    const droppedResource = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
      filter: (resource) => resource.resourceType == RESOURCE_ENERGY && resource.amount > 50
    });

    if (droppedResource) {
      if (creep.pickup(droppedResource) == ERR_NOT_IN_RANGE) {
        creep.moveToEfficiently(droppedResource);
      }
    } else {
      // If no dropped resources, fall back to harvesting from sources
      let source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
      if (source) {
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
          creep.moveToEfficiently(source);
        }
      }
    }
  }
}
