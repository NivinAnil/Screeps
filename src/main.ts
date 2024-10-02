// import modules
import "../prototype.creep";
import "./prototype.tower";
import "./prototype.spawn";
import "../role.harvester";
import "../role.upgrader";
import "../role.builder";
import "../role.repairer";
import "../role.wallRepairer";
import "../role.longDistanceHarvester";
import "../role.claimer";
import "../role.miner";
import "../role.lorry";
import "./role.defender";
import "./role.mineralHarvester";
import "./role.healer";
import * as _ from "lodash";

export function loop(): void {
  // Clear memory of dead creeps
  for (let name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
    }
  }

  // Run creep logic
  for (let name in Game.creeps) {
    Game.creeps[name].runRole();
  }

  // Run tower logic
  const towers = _.filter(
    Game.structures,
    (s) => s.structureType == STRUCTURE_TOWER
  ) as StructureTower[];
  towers.forEach((tower) => tower.defend());

  // Run spawn logic
  for (let spawnName in Game.spawns) {
    Game.spawns[spawnName].spawnCreepsIfNecessary();
    // Optional: Add periodic tasks
    if (Game.time % 100 === 0) {
      // Run tasks every 100 ticks
      console.log("Periodic task: " + Game.time);
      // Add your periodic tasks here
    }
  }
}

export {};
