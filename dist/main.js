"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loop = void 0;
// import modules
require("./prototype.creep");
require("./prototype.tower");
require("./prototype.spawn");
require("./role.harvester");
require("./role.upgrader");
require("./role.builder");
require("./role.repairer");
require("./role.wallRepairer");
require("./role.longDistanceHarvester");
require("./role.claimer");
require("./role.miner");
require("./role.lorry");
require("./role.defender");
require("./role.mineralHarvester");
require("./role.healer");
const _ = require("lodash");
function loop() {
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
    const towers = _.filter(Game.structures, (s) => s.structureType == STRUCTURE_TOWER);
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
exports.loop = loop;
//# sourceMappingURL=main.js.map