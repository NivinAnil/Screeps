var listOfRoles = ['harvester', 'lorry', 'claimer', 'upgrader', 'repairer', 'builder', 'wallRepairer', 'defender', 'mineralHarvester', 'scout', 'healer'];

// create a new function for StructureSpawn
StructureSpawn.prototype.spawnCreepsIfNecessary =
    function () {
        /** @type {Room} */
        let room = this.room;
        // find all creeps in room
        /** @type {Array.<Creep>} */
        let creepsInRoom = room.find(FIND_MY_CREEPS);
        
        // count the number of creeps alive for each role in this room
        // _.sum will count the number of properties in Game.creeps filtered by the
        //  arrow function, which checks for the creep being a specific role
        /** @type {Object.<string, number>} */
        let numberOfCreeps = {};
        listOfRoles.forEach(role => {
            numberOfCreeps[role] = _.sum(creepsInRoom, (c) => c.memory.role == role);
        });
        let maxEnergy = room.energyCapacityAvailable;
        let name = undefined;

        // Spawn backup creep if necessary
        if (numberOfCreeps['harvester'] == 0 && numberOfCreeps['lorry'] == 0) {
            if (numberOfCreeps['miner'] > 0 || (room.storage && room.storage.store[RESOURCE_ENERGY] >= 150 + 550)) {
                name = this.createLorry(150);
            } else {
                name = this.createCustomCreep(room.energyAvailable, 'harvester');
            }
        } else {
            // Check for miners
            let sources = room.find(FIND_SOURCES);
            for (let source of sources) {
                if (!_.some(creepsInRoom, c => c.memory.role == 'miner' && c.memory.sourceId == source.id)) {
                    let containers = source.pos.findInRange(FIND_STRUCTURES, 1, {
                        filter: s => s.structureType == STRUCTURE_CONTAINER
                    });
                    if (containers.length > 0) {
                        name = this.createMiner(source.id);
                        break;
                    }
                }
            }

            // Check for other roles
            if (!name) {
                for (let role of listOfRoles) {
                    if (role == 'claimer' && this.memory.claimRoom) {
                        name = this.createClaimer(this.memory.claimRoom);
                        if (name) {
                            delete this.memory.claimRoom;
                        }
                    } else if (this.memory.minCreeps && this.memory.minCreeps[role] && 
                               numberOfCreeps[role] < this.memory.minCreeps[role]) {
                        if (role == 'lorry') {
                            name = this.createLorry(150);
                        } else {
                            name = this.createCustomCreep(maxEnergy, role);
                        }
                        break;
                    }
                }
            }

            // Check for LongDistanceHarvesters
            if (!name && this.memory.minLongDistanceHarvesters) {
                for (let roomName in this.memory.minLongDistanceHarvesters) {
                    let actualNumber = _.sum(Game.creeps, (c) =>
                        c.memory.role == 'longDistanceHarvester' && c.memory.target == roomName);
                    if (actualNumber < this.memory.minLongDistanceHarvesters[roomName]) {
                        name = this.createLongDistanceHarvester(maxEnergy, 2, room.name, roomName, 0);
                        break;
                    }
                }
            }

            // Add logic for spawning new roles
            if (!name) {
                if (numberOfCreeps['defender'] < this.memory.minCreeps['defender']) {
                    name = this.createDefender(maxEnergy);
                } else if (numberOfCreeps['mineralHarvester'] < this.memory.minCreeps['mineralHarvester']) {
                    name = this.createMineralHarvester(maxEnergy);
                } else if (numberOfCreeps['scout'] < this.memory.minCreeps['scout']) {
                    name = this.createScout();
                } else if (numberOfCreeps['healer'] < this.memory.minCreeps['healer']) {
                    name = this.createHealer(maxEnergy);
                }
            }
        }

        // Log spawning result
        if (name && _.isString(name)) {
            console.log(this.name + " spawned new creep: " + name + " (" + Game.creeps[name].memory.role + ")");
            for (let role of listOfRoles) {
                console.log(role + ": " + numberOfCreeps[role]);
            }
        }
    };

// create a new function for StructureSpawn
StructureSpawn.prototype.createCustomCreep =
    function (energy, roleName) {
        // create a balanced body as big as possible with the given energy
        var numberOfParts = Math.floor(energy / 200);
        // make sure the creep is not too big (more than 50 parts)
        numberOfParts = Math.min(numberOfParts, Math.floor(50 / 3));
        var body = [];
        for (let i = 0; i < numberOfParts; i++) {
            body.push(WORK);
        }
        for (let i = 0; i < numberOfParts; i++) {
            body.push(CARRY);
        }
        for (let i = 0; i < numberOfParts; i++) {
            body.push(MOVE);
        }

        // create creep with the created body and the given role
        return this.spawnCreep(body, roleName + '_' + Game.time, { memory: { role: roleName, working: false }});
    };

// create a new function for StructureSpawn
StructureSpawn.prototype.createLongDistanceHarvester =
    function (energy, numberOfWorkParts, home, target, sourceIndex) {
        // create a body with the specified number of WORK parts and one MOVE part per non-MOVE part
        var body = [];
        for (let i = 0; i < numberOfWorkParts; i++) {
            body.push(WORK);
        }

        // 150 = 100 (cost of WORK) + 50 (cost of MOVE)
        energy -= 150 * numberOfWorkParts;

        var numberOfParts = Math.floor(energy / 100);
        // make sure the creep is not too big (more than 50 parts)
        numberOfParts = Math.min(numberOfParts, Math.floor((50 - numberOfWorkParts * 2) / 2));
        for (let i = 0; i < numberOfParts; i++) {
            body.push(CARRY);
        }
        for (let i = 0; i < numberOfParts + numberOfWorkParts; i++) {
            body.push(MOVE);
        }

        // create creep with the created body
        return this.spawnCreep(body, roleName + '_' + Game.time, { memory: {
            role: 'longDistanceHarvester',
            home: home,
            target: target,
            sourceIndex: sourceIndex,
            working: false
        }});
    };

// create a new function for StructureSpawn
StructureSpawn.prototype.createClaimer =
    function (target) {
        return this.spawnCreep([CLAIM, MOVE], 'claimer_' + Game.time, {memory: { role: 'claimer', target: target }});
    };

// create a new function for StructureSpawn
StructureSpawn.prototype.createMiner =
    function (sourceId) {
        //return this.spawnCreep([CLAIM, MOVE], 'claimer_' + Game.time, {memory: { role: 'claimer', target: target }});
        return this.spawnCreep([WORK, WORK, WORK, WORK, WORK, MOVE], 'miner_' + Game.time,
                                {memory: { role: 'miner', sourceId: sourceId }});
    };

// create a new function for StructureSpawn
StructureSpawn.prototype.createLorry =
    function (energy) {
        // create a body with twice as many CARRY as MOVE parts
        var numberOfParts = Math.floor(energy / 150);
        // make sure the creep is not too big (more than 50 parts)
        numberOfParts = Math.min(numberOfParts, Math.floor(50 / 3));
        var body = [];
        for (let i = 0; i < numberOfParts * 2; i++) {
            body.push(CARRY);
        }
        for (let i = 0; i < numberOfParts; i++) {
            body.push(MOVE);
        }

        // create creep with the created body and the role 'lorry'
        return this.spawnCreep(body, 'lorry_' + Game.time, {memory: { role: 'lorry', working: false }});
    };

// Add new functions for creating the new role creeps
StructureSpawn.prototype.createDefender = function(energy) {
    var body = [];
    var numberOfParts = Math.floor(energy / 190);
    numberOfParts = Math.min(numberOfParts, Math.floor(50 / 3));
    for (let i = 0; i < numberOfParts; i++) {
        body.push(ATTACK);
        body.push(MOVE);
    }
    return this.spawnCreep(body, 'defender_' + Game.time, {memory: {role: 'defender'}});
};

StructureSpawn.prototype.createMineralHarvester = function(energy) {
    var body = [];
    var numberOfParts = Math.floor(energy / 250);
    numberOfParts = Math.min(numberOfParts, Math.floor(50 / 3));
    for (let i = 0; i < numberOfParts; i++) {
        body.push(WORK);
        body.push(CARRY);
        body.push(MOVE);
    }
    return this.spawnCreep(body, 'mineralHarvester_' + Game.time, {memory: {role: 'mineralHarvester', working: false}});
};

StructureSpawn.prototype.createScout = function() {
    return this.spawnCreep([MOVE], 'scout_' + Game.time, {memory: {role: 'scout', targetRoom: this.memory.scoutTarget}});
};

StructureSpawn.prototype.createHealer = function(energy) {
    var body = [];
    var numberOfParts = Math.floor(energy / 300);
    numberOfParts = Math.min(numberOfParts, Math.floor(50 / 3));
    for (let i = 0; i < numberOfParts; i++) {
        body.push(HEAL);
        body.push(MOVE);
    }
    return this.spawnCreep(body, 'healer_' + Game.time, {memory: {role: 'healer'}});
};