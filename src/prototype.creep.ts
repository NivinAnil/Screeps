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

const roleColors: { [role: string]: string } = {
  harvester: "#ffaa00",
  upgrader: "#00ffaa",
  builder: "#00aaff",
  repairer: "#aaff00",
  wallRepairer: "#ff00aa",
  longDistanceHarvester: "#aa00ff",
  claimer: "#ffff00",
  miner: "#aaaaff",
  lorry: "#aaffaa",
  defender: "#ff0000",
  mineralHarvester: "#00ffff",
  healer: "#00ff00",
};

declare global {
  interface CreepMemory {
    role: string;
    working?: boolean;
    home?: string;
    target?: string;
    sourceIndex?: number;
    sourceId?: Id<Source>;
    cachedPath?: string;
    cachedPathTarget?: string;
  }

  interface Creep {
    runRole(): void;
    getEnergy(useContainer: boolean, useSource: boolean): void;
    moveToEfficiently(
      target: RoomPosition | { pos: RoomPosition }
    ):
      | CreepMoveReturnCode
      | ERR_NO_PATH
      | ERR_INVALID_TARGET
      | ERR_NOT_FOUND
      | -10;
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
    filter: (resource) =>
      resource.resourceType == RESOURCE_ENERGY && resource.amount > 50,
  });

  if (droppedResource) {
    if (this.pickup(droppedResource) == ERR_NOT_IN_RANGE) {
      this.moveToEfficiently(droppedResource);
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
        this.moveToEfficiently(container);
      }
    }
  }

  if (!container && useSource) {
    const source = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
    if (source && this.harvest(source) == ERR_NOT_IN_RANGE) {
      this.moveToEfficiently(source);
    }
  }
};

Creep.prototype.moveToEfficiently = function (
  target: RoomPosition | { pos: RoomPosition }
): CreepMoveReturnCode | ERR_NO_PATH | ERR_INVALID_TARGET | ERR_NOT_FOUND {
  const targetPos = target instanceof RoomPosition ? target : target.pos;

  // Visualize the path
  const color = roleColors[this.memory.role] || "#ffffff";
  this.room.visual.line(this.pos, targetPos, {
    color: color,
    lineStyle: "dashed",
  });

  // Use the built-in moveTo function
  return this.moveTo(targetPos, {
    visualizePathStyle: { stroke: color, lineStyle: "dashed" },
    reusePath: 5, // Reuse path for 5 ticks
  });
};

// Helper function to get direction
function getDirection(dx: number, dy: number): number {
  if (dx === 0 && dy === -1) return TOP;
  if (dx === 1 && dy === -1) return TOP_RIGHT;
  if (dx === 1 && dy === 0) return RIGHT;
  if (dx === 1 && dy === 1) return BOTTOM_RIGHT;
  if (dx === 0 && dy === 1) return BOTTOM;
  if (dx === -1 && dy === 1) return BOTTOM_LEFT;
  if (dx === -1 && dy === 0) return LEFT;
  if (dx === -1 && dy === -1) return TOP_LEFT;
  return 0;
}

export {};
