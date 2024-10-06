export function run(creep: Creep): void {
  console.log(
    `Lorry ${creep.name} is running. Working: ${creep.memory.working}`
  );

  if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
    creep.memory.working = false;
    console.log(`Lorry ${creep.name} is now collecting`);
  } else if (!creep.memory.working && creep.store.getFreeCapacity() == 0) {
    creep.memory.working = true;
    console.log(`Lorry ${creep.name} is now delivering`);
  }

  if (creep.memory.working) {
    // Delivery logic remains the same
    let structure: AnyStructure | null = creep.pos.findClosestByPath(
      FIND_MY_STRUCTURES,
      {
        filter: (s) =>
          (s.structureType == STRUCTURE_SPAWN ||
            s.structureType == STRUCTURE_EXTENSION ||
            s.structureType == STRUCTURE_TOWER) &&
          s.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
      }
    );

    if (structure == null) {
      structure = creep.room.storage || null;
    }

    if (structure) {
      if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        let moveResult = creep.moveTo(structure);
        console.log(`Lorry ${creep.name} move result: ${moveResult}`);
      }
      console.log(
        `Lorry ${creep.name} is trying to deliver to: ${structure?.pos}`
      );
    }
  } else {
    // Collection logic - prioritize containers and storage
    let target: Structure | Resource | null = null;

    // First, check for containers and storage
    target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (s) =>
        (s.structureType == STRUCTURE_CONTAINER ||
          s.structureType == STRUCTURE_STORAGE) &&
        s.store[RESOURCE_ENERGY] > creep.store.getFreeCapacity()
    });

    // If no suitable container/storage found, look for large dropped resources
    if (!target) {
      target = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
        filter: (r) => r.resourceType == RESOURCE_ENERGY && r.amount > 100
      });
    }

    if (target) {
      let actionResult;
      if (target instanceof Structure) {
        actionResult = creep.withdraw(target, RESOURCE_ENERGY);
      } else {
        actionResult = creep.pickup(target);
      }

      if (actionResult == ERR_NOT_IN_RANGE) {
        let moveResult = creep.moveTo(target);
        console.log(`Lorry ${creep.name} move result: ${moveResult}`);
      }
      console.log(
        `Lorry ${creep.name} is trying to collect from: ${target.pos}`
      );
    } else {
      console.log(`Lorry ${creep.name} couldn't find any energy to collect`);
    }
  }
}
