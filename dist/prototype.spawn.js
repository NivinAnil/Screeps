"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const listOfRoles = [
    "harvester",
    "claimer",
    "upgrader",
    "miner",
    "lorry",
    "repairer",
    "builder",
    "wallRepairer",
    "defender",
    "mineralHarvester",
    "scout",
    "healer",
];
StructureSpawn.prototype.spawnCreepsIfNecessary = function () {
    const room = this.room;
    const creepsInRoom = room.find(FIND_MY_CREEPS);
    let numberOfCreeps = {};
    for (let role of listOfRoles) {
        numberOfCreeps[role] = _.filter(creepsInRoom, (c) => c.memory.role == role).length;
    }
    const maxEnergy = room.energyCapacityAvailable;
    let name = undefined;
    // Initialize minCreeps if it doesn't exist
    if (!this.memory.minCreeps) {
        this.memory.minCreeps = {
            harvester: 2,
            upgrader: 2,
            miner: room.find(FIND_SOURCES).length,
            lorry: 1,
            builder: 2,
            repairer: 1,
            wallRepairer: 0,
            claimer: 0,
            longDistanceHarvester: 0,
            defender: 1,
            mineralHarvester: 0,
        };
    }
    // Prioritized roles order
    const prioritizedRoles = [
        "harvester",
        "upgrader",
        "miner",
        "lorry",
        ...listOfRoles.filter((role) => !["harvester", "miner", "lorry"].includes(role)),
    ];
    console.log(`Current energy: ${this.room.energyAvailable}/${maxEnergy}`);
    // Check for each role and spawn if necessary
    for (let role of prioritizedRoles) {
        console.log(`Checking role: ${role}, current: ${numberOfCreeps[role]}, min: ${this.memory.minCreeps[role] || 0}`);
        if (numberOfCreeps[role] < (this.memory.minCreeps[role] || 0)) {
            console.log(`Attempting to spawn ${role}`);
            let spawnResult;
            // Don't spawn lorry if there are no miners
            if (role === "lorry" && numberOfCreeps["miner"] === 0) {
                continue;
            }
            if (role === "harvester") {
                spawnResult = this.createCustomCreep(Math.min(maxEnergy, 300), role);
            }
            else if (role === "miner") {
                const sources = room.find(FIND_SOURCES);
                // Find a source without a miner
                const sourceWithoutMiner = sources.find(source => !_.some(creepsInRoom, c => c.memory.role === "miner" && c.memory.sourceId === source.id));
                console.log("Source without miner:", sourceWithoutMiner);
                if (sourceWithoutMiner) {
                    spawnResult = this.createMiner(sourceWithoutMiner.id);
                }
                else {
                    continue; // Skip to next role if all sources have miners
                }
            }
            else if (role === "lorry") {
                spawnResult = this.createLorry(maxEnergy);
            }
            else if (role === "claimer") {
                spawnResult = this.createClaimer(this.memory.claimRoom || "");
            }
            else {
                spawnResult = this.createCustomCreep(maxEnergy, role);
            }
            if (spawnResult === OK) {
                name = role + "_" + Game.time;
                console.log(`Successfully spawned ${role}`);
                break; // Exit the loop after successfully spawning a creep
            }
            else {
                console.log(`Failed to spawn ${role}, result: ${spawnResult}`);
            }
        }
    }
    // If no creeps are spawning, check for long distance harvesters
    if (!name) {
        for (let roomName in this.memory.minLongDistanceHarvesters) {
            if (numberOfCreeps["longDistanceHarvester"] <
                this.memory.minLongDistanceHarvesters[roomName]) {
                let spawnResult = this.createLongDistanceHarvester(maxEnergy, 5, this.room.name, roomName, 0);
                if (spawnResult == OK) {
                    name = "longDistanceHarvester_" + Game.time;
                    break;
                }
            }
        }
    }
    return name;
};
StructureSpawn.prototype.createCustomCreep = function (energy, roleName) {
    let numberOfParts = Math.floor(energy / 200);
    let body = [];
    for (let i = 0; i < numberOfParts; i++) {
        body.push(WORK);
        body.push(CARRY);
        body.push(MOVE);
    }
    console.log(`Attempting to spawn ${roleName} with body: ${body}`);
    return this.spawnCreep(body, roleName + "_" + Game.time, {
        memory: { role: roleName, working: false },
    });
};
StructureSpawn.prototype.createLongDistanceHarvester = function (energy, numberOfWorkParts, home, target, sourceIndex) {
    let body = [];
    for (let i = 0; i < numberOfWorkParts; i++) {
        body.push(WORK);
    }
    energy -= 150 * numberOfWorkParts;
    let numberOfParts = Math.floor(energy / 100);
    for (let i = 0; i < numberOfParts; i++) {
        body.push(CARRY);
        body.push(MOVE);
    }
    body.push(MOVE);
    return this.spawnCreep(body, "ldh_" + Game.time, {
        memory: {
            role: "longDistanceHarvester",
            home: home,
            target: target,
            sourceIndex: sourceIndex,
            working: false,
        },
    });
};
StructureSpawn.prototype.createClaimer = function (target) {
    const body = [CLAIM, MOVE];
    return this.spawnCreep(body, "claimer_" + Game.time, {
        memory: { role: "claimer", target: target },
    });
};
StructureSpawn.prototype.createMiner = function (sourceId) {
    const body = [WORK, WORK, WORK, WORK, WORK, MOVE];
    return this.spawnCreep(body, "miner_" + Game.time, {
        memory: {
            role: "miner",
            sourceId: sourceId,
            working: false,
        },
    });
};
StructureSpawn.prototype.createLorry = function (energy) {
    const body = [];
    const numberOfParts = Math.floor(energy / 150);
    const limitedParts = Math.min(numberOfParts, Math.floor(50 / 3));
    for (let i = 0; i < limitedParts; i++) {
        body.push(CARRY);
        body.push(CARRY);
        body.push(MOVE);
    }
    return this.spawnCreep(body, "lorry_" + Game.time, {
        memory: { role: "lorry", working: false },
    });
};
StructureSpawn.prototype.createDefender = function (energy) {
    const body = [];
    const numberOfParts = Math.floor(energy / 190);
    const limitedParts = Math.min(numberOfParts, Math.floor(50 / 3));
    for (let i = 0; i < limitedParts; i++) {
        body.push(ATTACK);
        body.push(MOVE);
    }
    return this.spawnCreep(body, "defender_" + Game.time, {
        memory: { role: "defender" },
    });
};
StructureSpawn.prototype.createMineralHarvester = function (energy) {
    const body = [];
    const numberOfParts = Math.floor(energy / 250);
    const limitedParts = Math.min(numberOfParts, Math.floor(50 / 3));
    for (let i = 0; i < limitedParts; i++) {
        body.push(WORK);
        body.push(CARRY);
        body.push(MOVE);
    }
    return this.spawnCreep(body, "mineralHarvester_" + Game.time, {
        memory: { role: "mineralHarvester", working: false },
    });
};
StructureSpawn.prototype.createScout = function () {
    return this.spawnCreep([MOVE], "scout_" + Game.time, {
        memory: { role: "scout", target: this.memory.scoutTarget },
    });
};
StructureSpawn.prototype.createHealer = function (energy) {
    const body = [];
    const numberOfParts = Math.floor(energy / 300);
    const limitedParts = Math.min(numberOfParts, Math.floor(50 / 3));
    for (let i = 0; i < limitedParts; i++) {
        body.push(HEAL);
        body.push(MOVE);
    }
    return this.spawnCreep(body, "healer_" + Game.time, {
        memory: { role: "healer" },
    });
};
//# sourceMappingURL=prototype.spawn.js.map