"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const listOfRoles = [
    "harvester",
    "lorry",
    "claimer",
    "upgrader",
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
    // Check for each role and spawn if necessary
    for (let role of listOfRoles) {
        if (numberOfCreeps[role] < this.memory.minCreeps[role]) {
            let spawnResult;
            if (role == "lorry") {
                spawnResult = this.createLorry(maxEnergy);
            }
            else if (role == "claimer") {
                spawnResult = this.createClaimer(this.memory.claimRoom || "");
            }
            else {
                spawnResult = this.createCustomCreep(maxEnergy, role);
            }
            if (spawnResult == OK) {
                name = role + "_" + Game.time;
            }
            if (name)
                break;
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