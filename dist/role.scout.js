export function run(creep) {
    if (creep.room.name != creep.memory.targetRoom) {
        const exit = creep.room.findExitTo(creep.memory.targetRoom);
        if (exit) {
            creep.moveTo(creep.pos.findClosestByRange(exit) || creep.pos);
        }
    }
    else {
        // Gather intelligence, e.g., check for hostile creeps, structures, etc.
        const hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
        if (hostiles.length > 0) {
            creep.memory.hostileSpotted = true;
            // Optionally, retreat or send a message back to base
        }
        // Move around the room to scout
        creep.moveTo(25, 25);
    }
}
//# sourceMappingURL=role.scout.js.map