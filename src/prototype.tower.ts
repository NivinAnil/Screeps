declare global {
  interface StructureTower {
    defend(): void;
  }
}

StructureTower.prototype.defend = function (): void {
  const target = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
  if (target) {
    this.attack(target);
  }
};

export {};
