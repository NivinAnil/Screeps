"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
function run(creep) {
    const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (target) {
        if (creep.attack(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    }
    else {
        creep.moveTo(Game.flags['RallyPoint']);
    }
}
exports.run = run;
//# sourceMappingURL=role.defender.js.map