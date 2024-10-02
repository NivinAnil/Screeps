module.exports = {
    run: function(creep) {
        if(creep.room.name != creep.memory.targetRoom) {
            var exit = creep.room.findExitTo(creep.memory.targetRoom);
            creep.moveTo(creep.pos.findClosestByRange(exit));
        } else {
            // Gather intelligence, e.g., check for hostile creeps, structures, etc.
            var hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
            if(hostiles.length > 0) {
                creep.memory.hostileSpotted = true;
                // Optionally, retreat or send a message back to base
            }
            // Move around the room to scout
            creep.moveTo(25, 25);
        }
    }
};