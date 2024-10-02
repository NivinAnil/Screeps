module.exports = {
    run: function(creep) {
        if(creep.store.getFreeCapacity() > 0) {
            var mineral = creep.room.find(FIND_MINERALS)[0];
            if(creep.harvest(mineral) == ERR_NOT_IN_RANGE) {
                creep.moveTo(mineral);
            }
        }
        else {
            var storage = creep.room.storage;
            if(creep.transfer(storage, Object.keys(creep.store)[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(storage);
            }
        }
    }
};