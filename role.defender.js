module.exports = {
    run: function(creep) {
        var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(target) {
            if(creep.attack(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        } else {
            // Move to a designated rally point when no hostiles are present
            creep.moveTo(Game.flags['RallyPoint']);
        }
    }
};