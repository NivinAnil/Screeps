export function run(creep: Creep): void {
    const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if(target) {
        if(creep.attack(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    } else {
        creep.moveTo(Game.flags['RallyPoint']);
    }
}