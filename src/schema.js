export default class Schema {
  constructor(name, id) {
    this.name = name;
    this.id = id;
  }

  keyById(entity) {
    return {
      [entity[this.id]]: entity
    };
  }

  replaceWithId(entity) {
    return entity?.[this.id] ?? entity;
  }

  normalize(entity) {
    return Array.isArray(entity) ? this.normalizeAll(entity) : this.normalizeOne(entity);
  }

  normalizeAll(entities) {
    return entities.reduce((memo, entity) => ({ ...memo, ...this.normalizeOne(entity) }), {});
  }
}
