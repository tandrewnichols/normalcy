import Schema from './schema';

export default class ShapefulSchema extends Schema {
  constructor(name, id, shape) {
    super(name, id);
    this.shape = shape;
  }

  normalizeOne(entity) {
    return {
      [this.getId(entity)]: this.walkShape(this.shape, entity)
    };
  }

  walkShape(shape, entity) {
    return {
      ...entity,
      ...Object.entries(shape).reduce((memo, [key, val]) => {
        const subEntity = entity[key];
        let value;

        if (val instanceof Schema) {
          value = val.replaceWithId(subEntity);
        } else if (Array.isArray(val) && Array.isArray(subEntity)) {
          if (val[0] instanceof Schema) {
            value = subEntity.map((subEnt) => val[0].replaceWithId(subEnt));
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

  findAndNorm(subSchema, entity) {
    return Array.isArray(entity) ? this.findAndNormAll(subSchema, entity) : this.findAndNormOne(subSchema, entity);
  }

  findAndNormOne(subSchema, entity) {
    const recurse = (currentShape, currentEntity) => {
      for (let [key, val] of Object.entries(currentShape)) {
        if (val instanceof Schema) {
          if (val.is(subSchema.name) && currentEntity[key]) {
            return val.normalize(currentEntity[key]);
          }

          if (currentEntity[key]) {
            return recurse(val.shape, currentEntity[key]);
          }
        }

        if (val !== null && typeof val === 'object') {
          return recurse(val, currentEntity[key]);
        }

        continue;
      }
    };

    return recurse(this.shape, entity);
  }

  findAndNormAll(subSchema, entities) {
    return entities.reduce((memo, entity) => ({ ...memo, ...this.findAndNormOne(subSchema, entity) }), {});
  }
}
