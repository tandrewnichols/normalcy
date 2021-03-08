export default class Schema {
  constructor(name, id) {
    this.name = name;
    this.id = id;
  }

  getId(entity) {
    if (typeof this.id === 'function') {
      return this.id(entity);
    } else {
      return entity?.[this.id];
    }
  }

  keyById(entity) {
    return {
      [this.getId(entity)]: entity
    };
  }

  replaceWithId(entity) {
    return this.getId(entity) ?? entity;
  }

  normalize(entity) {
    return Array.isArray(entity) ? this.normalizeAll(entity) : this.normalizeOne(entity);
  }

  normalizeAll(entities) {
    return entities.reduce((memo, entity) => ({ ...memo, ...this.normalizeOne(entity) }), {});
  }
}
