StructureTower.prototype.defend = function () {
    const target = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (target) {
        this.attack(target);
    }
};
export {};
//# sourceMappingURL=prototype.tower.js.map