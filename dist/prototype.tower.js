"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
StructureTower.prototype.defend = function () {
    const target = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (target) {
        this.attack(target);
    }
};
//# sourceMappingURL=prototype.tower.js.map