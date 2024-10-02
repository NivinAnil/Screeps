"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
function run(creep) {
    if (creep.room.name != creep.memory.target) {
        const exit = creep.room.findExitTo(creep.memory.target);
        if (exit !== ERR_NO_PATH && exit !== ERR_INVALID_ARGS) {
            const exitPos = creep.pos.findClosestByRange(exit);
            if (exitPos) {
                creep.moveTo(exitPos);
            }
        }
    }
    else {
        if (creep.room.controller && creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
        }
    }
}
exports.run = run;
//# sourceMappingURL=role.claimer.js.map