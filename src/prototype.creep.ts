import { run as runHarvester } from "./role.harvester";
import { run as runUpgrader } from "./role.upgrader";
import { run as runBuilder } from "./role.builder";
import { run as runRepairer } from "./role.repairer";
import { run as runWallRepairer } from "./role.wallRepairer";
import { run as runLongDistanceHarvester } from "./role.longDistanceHarvester";
import { run as runClaimer } from "./role.claimer";
import { run as runMiner } from "./role.miner";
import { run as runLorry } from "./role.lorry";
import { run as runDefender } from "./role.defender";
import { run as runMineralHarvester } from "./role.mineralHarvester";
import { run as runHealer } from "./role.healer";

const roles: { [key: string]: (creep: Creep) => void } = {
  harvester: runHarvester,
  upgrader: runUpgrader,
  builder: runBuilder,
  repairer: runRepairer,
  wallRepairer: runWallRepairer,
  longDistanceHarvester: runLongDistanceHarvester,
  claimer: runClaimer,
  miner: runMiner,
  lorry: runLorry,
  defender: runDefender,
  mineralHarvester: runMineralHarvester,
  healer: runHealer,
};

declare global {
  interface Creep {
    runRole(): void;
    getEnergy(useContainer: boolean, useSource: boolean): void;
  }
}

Creep.prototype.runRole = function (): void {
  const role = this.memory.role;
  if (role in roles) {
    roles[role](this);
  } else {
    console.log(`Unknown role: ${role}`);
  }
};

Creep.prototype.getEnergy = function (
  useContainer: boolean,
  useSource: boolean
): void {
  let container: StructureContainer | null = null;
  
  // First, check for dropped resources
  const droppedResource = this.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
    filter: resource => resource.resourceType == RESOURCE_ENERGY && resource.amount > 50
  });

  if (droppedResource) {
    if (this.pickup(droppedResource) == ERR_NOT_IN_RANGE) {
      this.moveTo(droppedResource);
    }
    return;
  }

  // If no dropped resources, proceed with container and source logic
  if (useContainer) {
    container = this.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (s) =>
        (s.structureType == STRUCTURE_CONTAINER ||
          s.structureType == STRUCTURE_STORAGE) &&
        s.store[RESOURCE_ENERGY] > 0,
    }) as StructureContainer | null;

    if (container) {
      if (this.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        this.moveTo(container);
      }
    }
  }

  if (!container && useSource) {
    const source = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
    if (source && this.harvest(source) == ERR_NOT_IN_RANGE) {
      this.moveTo(source);
    }
  }
};
