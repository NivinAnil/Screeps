module.exports = {
    run: function(creep) {
        var damagedCreep = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
            filter: (c) => c.hits < c.hitsMax
        });
        if(damagedCreep) {
            if(creep.heal(damagedCreep) == ERR_NOT_IN_RANGE) {
                creep.moveTo(damagedCreep);
            }
        } else {
            // Follow a tank or move to a rally point when no one needs healing
            var tank = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
                filter: (c) => c.memory.role == 'defender'
            });
            if(tank) {
                creep.moveTo(tank);
            } else {
                creep.moveTo(Game.flags['HealerRally']);
            }
        }
    }
};