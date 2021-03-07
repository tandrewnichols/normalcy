import Schema from './schema';

export default class ShapefulSchema extends Schema {
  constructor(name, id, shape) {
    super(name, id);
    this.shape = shape;
  }

  normalizeOne(entity) {
    return {
      [entity[this.id]]: this.walkShape(this.shape, entity)
    };
  }

  walkShape(shape, entity) {
    return {
      ...entity,
      ...Object.entries(shape).reduce((memo, [key, val]) => {
        const subEntity = entity[key];
        let value;

        if (val instanceof Schema) {
          value = this.replaceWithId(subEntity);
        } else if (Array.isArray(val) && Array.isArray(subEntity)) {
          if (val[0] instanceof Schema) {
            value = subEntity.map((subEnt) => this.replaceWithId(subEnt));
          } else {
            value = subEntity.map((subEnt) => this.walkShape(val[0], subEnt));
          }
        } else {
          value = this.walkShape(val, entity[key]);
        }

        return { ...memo, [key]: value };
      }, {})
    };
  }
}
