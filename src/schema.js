import keyBy from 'lodash/keyBy';
import cloneDeep from 'lodash/cloneDeep';

const isArr = Array.isArray.bind(Array);
const mkArr = (thing) => isArr(thing) ? thing : [thing];

export default class Schema {
  constructor(name, id, shape) {
    this.name = name;
    this.id = id;
    this.shape = shape || {};
    this.nestedSchema = {};
    this.findSubSchemas(this.shape);
    console.log(this.nestedSchemas);
  }

  findSubSchemas(shape, currentPath = []) {
    for (let [key, val] of Object.entries(shape)) {
      console.log(key, val);
      currentPath.push(key);
      if (val instanceof Schema) {
        this.nestedSchemas[ val.name ] ||= [];
        this.nestedSchemas[ val.name ].push(currentPath.join('.'));
      } else if (Array.isArray(val)) {
        this.findSubSchemas(val, currentPath);
      } else if (val !== null && typeof val === 'object') {
        this.findSubSchemas(val, currentPath);
      }
    }
  }

  is(name) {
    return name === this.name; 
  }

  getId(entity, altId) {
    if (altId) {
      return entity?.[altId];
    }

    if (typeof this.id === 'function') {
      return this.id(entity);
    }

    return entity?.[this.id];
  }

  keyById(entity, reducerId) {
    if (reducerId) {
      const { [reducerId]: id, ...ent } = entity;
      return {
        [entity[reducerId]]: {
          [this.id]: id,
          ...ent
        }
      };
    }

    return {
      [this.getId(entity)]: entity
    };
  }

  replaceWithId(entity) {
    return this.getId(entity) ?? entity;
  }

  normalizeDisambiguation(entity, disambiguation) {
    if (typeof disambiguation === 'function') {
      disambiguation = disambiguation(entity);
    }

    if (typeof disambiguation === 'string') {
      return disambiguation.split('.');
    }

    if (Array.isArray(disambiguation)) {
      return [...disambiguation];
    }

    return [];
  }

  normSubEntities(shape, obj) {
    for (let [key, val] of Object.entries(shape)) {
      if (val instanceof Schema && obj) {
        return isArr(obj) ? obj.map(this.getId) : this.getId(obj);
      }

      if (isArr(val) && isArr(obj[key])) {
        return {
          ...obj,
          [key]: this.normSubEntities(val[0], obj[key])
        };
      }

      if (val !== null && typeof val === 'object') {
        return {
          ...obj,
          [key]: this.normSubEntities(val, obj[key])
        };
      }
    }
  }

  normalize(payload, altId) {
    if (!payload || typeof payload !== 'object') {
      return {};
    }

    payload = mkArr(payload);

    return payload.reduce((memo, entity) => ({
      ...memo,
      [this.getId(entity, altId)]: this.normSubEntities(this.shape, entity)
    }), {});
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
        } else if (isArr(val) && isArr(subEntity)) {
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
    return isArr(entity) ? this.findAndNormAll(subSchema, entity) : this.findAndNormOne(subSchema, entity);
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

        if (isArr(val) && isArr(currentEntity[key])) {
          if (val[0] instanceof Schema && val[0].is(subSchema.name)) {
            return currentEntity[key].reduce((memo, ent) => ({ ...memo, ...val[0].normalize(ent) }), {})
          } else {
            continue;
          }
        }

        if (val !== null && typeof val === 'object' && currentEntity[key]) {
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
