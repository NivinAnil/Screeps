"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const role_upgrader_1 = require("./role.upgrader");
function run(creep) {
    if (creep.memory.target != undefined &&
        creep.room.name != creep.memory.target) {
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
    }
    else if (!creep.memory.working && creep.store.getFreeCapacity() == 0) {
        creep.memory.working = true;
    }
    if (creep.memory.working) {
        const constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        if (constructionSite) {
            if (creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
                creep.moveTo(constructionSite);
            }
        }
        else {
            (0, role_upgrader_1.run)(creep);
        }
    }
    else {
        creep.getEnergy(true, true);
    }
}
exports.run = run;
//# sourceMappingURL=role.builder.js.map