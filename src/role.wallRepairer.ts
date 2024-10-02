import { run as runBuilder } from "./role.builder";

export function run(creep: Creep): void {
  if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
    creep.memory.working = false;
  } else if (!creep.memory.working && creep.store.getFreeCapacity() == 0) {
    creep.memory.working = true;
  }

  if (creep.memory.working) {
    const walls = creep.room.find(FIND_STRUCTURES, {
      filter: (s) => s.structureType == STRUCTURE_WALL,
    });

    let target: Structure | null = null;

    for (let percentage = 0.0001; percentage <= 1; percentage += 0.0001) {
      for (let wall of walls) {
        if (wall.hits / wall.hitsMax < percentage) {
          target = wall;
          break;
        }
      }
      if (target) break;
    }

    if (target) {
      if (creep.repair(target) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
      }
    } else {
      runBuilder(creep);
    }
  } else {
    creep.getEnergy(true, true);
  }
}
