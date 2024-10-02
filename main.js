// import modules
require('prototype.creep');
require('prototype.tower');
require('prototype.spawn');
require('role.defender');
require('role.mineralHarvester');
require('role.scout');
require('role.healer');

module.exports.loop = function() {
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
    var towers = _.filter(Game.structures, s => s.structureType == STRUCTURE_TOWER);
    towers.forEach(tower => tower.defend());

    // Run spawn logic
    for (let spawnName in Game.spawns) {
        Game.spawns[spawnName].spawnCreepsIfNecessary();
    }

    // Optional: Add periodic tasks
    if (Game.time % 100 === 0) {
        // Run tasks every 100 ticks
        console.log('Periodic task: ' + Game.time);
        // Add your periodic tasks here
    }
};