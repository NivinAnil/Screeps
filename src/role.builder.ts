import { run as runUpgrader } from "./role.upgrader";

export function run(creep: Creep): void {
  if (
    creep.memory.target != undefined &&
    creep.room.name != creep.memory.target
  ) {
    const exit = creep.room.findExitTo(creep.memory.target);
    if (exit !== ERR_NO_PATH && exit !== ERR_INVALID_ARGS) {
      const exitPos = creep.pos.findClosestByRange(exit);
      if (exitPos) {
        creep.moveTo(exitPos);
      }
    }
    return;
  }

  if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
    creep.memory.working = false;
  } else if (!creep.memory.working && creep.store.getFreeCapacity() == 0) {
    creep.memory.working = true;
  }

  if (creep.memory.working) {
    const constructionSite = creep.pos.findClosestByPath(
      FIND_CONSTRUCTION_SITES
    );
    if (constructionSite) {
      if (creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
        creep.moveTo(constructionSite);
      }
    } else {
      runUpgrader(creep);
    }
  } else {
    creep.getEnergy(true, true);
  }
}
