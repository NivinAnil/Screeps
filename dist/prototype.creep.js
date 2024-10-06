"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const role_harvester_1 = require("./role.harvester");
const role_upgrader_1 = require("./role.upgrader");
const role_builder_1 = require("./role.builder");
const role_repairer_1 = require("./role.repairer");
const role_wallRepairer_1 = require("./role.wallRepairer");
const role_longDistanceHarvester_1 = require("./role.longDistanceHarvester");
const role_claimer_1 = require("./role.claimer");
const role_miner_1 = require("./role.miner");
const role_lorry_1 = require("./role.lorry");
const role_defender_1 = require("./role.defender");
const role_mineralHarvester_1 = require("./role.mineralHarvester");
const role_healer_1 = require("./role.healer");
const roles = {
    harvester: role_harvester_1.run,
    upgrader: role_upgrader_1.run,
    builder: role_builder_1.run,
    repairer: role_repairer_1.run,
    wallRepairer: role_wallRepairer_1.run,
    longDistanceHarvester: role_longDistanceHarvester_1.run,
    claimer: role_claimer_1.run,
    miner: role_miner_1.run,
    lorry: role_lorry_1.run,
    defender: role_defender_1.run,
    mineralHarvester: role_mineralHarvester_1.run,
    healer: role_healer_1.run,
};
Creep.prototype.runRole = function () {
    const role = this.memory.role;
    if (role in roles) {
        roles[role](this);
    }
    else {
        console.log(`Unknown role: ${role}`);
    }
};
Creep.prototype.getEnergy = function (useContainer, useSource) {
    let container = null;
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
            filter: (s) => (s.structureType == STRUCTURE_CONTAINER ||
                s.structureType == STRUCTURE_STORAGE) &&
                s.store[RESOURCE_ENERGY] > 0,
        });
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
//# sourceMappingURL=prototype.creep.js.map