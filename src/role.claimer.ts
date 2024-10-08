export function run(creep: Creep): void {
    if (creep.room.name != creep.memory.target) {
        const exit = creep.room.findExitTo(creep.memory.target as string);
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