const isArr = Array.isArray.bind(Array);

export default class Schema {
  constructor(name, id) {
    this.name = name;
    this.id = id;
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

  normalize(entity, reducerId) {
    return isArr(entity) ? this.normalizeAll(entity, reducerId) : this.normalizeOne(entity, reducerId);
  }

  normalizeOne(entity, reducerId) {
    return this.keyById(entity, reducerId);
  }

  normalizeAll(entities, reducerId) {
    return entities.reduce((memo, entity) => ({ ...memo, ...this.normalizeOne(entity, reducerId) }), {});
  }

  reduceEntities(entities, fn, ...rest) {
    return entities.reduce((memo, entity) => ({ ...memo, ...fn(entity, ...rest) }), {});
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

  findAndAdd(entity, ...rest) {
    const fn = isArr(entity) ? 'findAndAddAll' : 'findAndAddOne';
    return this[fn](entity, ...rest);
  }

  findAndAddOne(entity, state, subSchema, id, reducerId, disambiguation) {
    disambiguation = this.normalizeDisambiguation(entity, disambiguation);

    const recurse = (currentState, currentShape, currentEntity) => {
      for (let [key, val] of Object.entries(currentShape)) {
        if (disambiguation.length) {
          if (disambiguation[0] !== key) {
            continue;
          }

          disambiguation.shift();
        }

        if (val instanceof Schema && val.is(subSchema.name)) {
          return {
            ...currentState,
            [key]: val.getId(currentEntity, reducerId)
          };
        }

        if (isArr(val) && val[0] instanceof Schema && val[0].is(subSchema.name)) {
          if (!currentState[key]) {
            return {
              ...currentState,
              [key]: [ val[0].getId(currentEntity, reducerId) ]
            };
          }

          return {
            ...currentState,
            [key]: [ ...currentState[key], val[0].getId(currentEntity, reducerId) ]
          };
        }

        if (val !== null && typeof val === 'object') {
          return {
            ...currentState,
            [key]: recurse(currentState[key], val, currentEntity)
          };
        }
      }
    };

    const entId = typeof id === 'function' ? id(entity) : entity[id];

    return {
      ...state,
      [entId]: recurse(state[entId], this.shape, entity)
    };
  }

  findAndAddAll(entities, ...rest) {
    return this.reduceEntities(entities, this.findAndAddOne.bind(this), ...rest);
  }

  remove(state, entity, reducerId) {
    const fn = isArr(entity) ? 'removeAll' : 'removeOne';
    return this[fn](state, entity, reducerId);
  }

  removeOne(state, entity, reducerId) {
    const { [this.getId(entity, reducerId)]: removed, ...newState } = state;
    return { ...newState };
  }

  removeAll(state, entities, reducerId) {
    return entities.reduce((memo, entity) => this.removeOne(memo, entity, reducerId), state);
  }

  findAndRemove(entity, ...rest) {
    const fn = isArr(entity) ? 'findAndRemoveAll' : 'findAndRemoveOne';
    return this[fn](entity, ...rest);
  }

  findAndRemoveOne(entity, state, subSchema, id, reducerId, disambiguation) {
    disambiguation = this.normalizeDisambiguation(entity, disambiguation);

    const recurse = (currentState, currentShape, currentEntity) => {
      for (let [key, val] of Object.entries(currentShape)) {
        if (disambiguation.length) {
          if (disambiguation[0] !== key) {
            continue;
          }

          disambiguation.shift();
        }

        if (val instanceof Schema && val.is(subSchema.name) && currentState[key] === val.getId(currentEntity, reducerId)) {
          const { [key]: removed, ...newState } = currentState;
          return { ...newState };
        }

        if (isArr(val) && isArr(currentState[key]) && val[0] instanceof Schema && val[0].is(subSchema.name)) {
          const id = val[0].getId(currentEntity, reducerId);

          return {
            ...currentState,
            [key]: currentState[key].filter((item) => item !== id)
          };
        }

        if (val !== null && typeof val === 'object') {
          return {
            ...currentState,
            [key]: recurse(currentState[key], val, currentEntity)
          };
        }

        return currentState;
      }
    };

    const entId = typeof id === 'function' ? id(entity) : entity[id];

    return {
      ...state,
      [entId]: recurse(state[entId], this.shape, entity)
    };
  }

  findAndRemoveAll(entities, ...rest) {
    return this.reduceEntities(entities, this.findAndRemoveOne.bind(this), ...rest);
  }

  merge(state, entity) {
    return isArr(entity) ? this.mergeAll(state, entity) : this.mergeOne(state, entity);
  }

  mergeOne(state, entity) {
    const id = this.getId(entity);
    return {
      ...state,
      [id]: {
        ...state[id],
        ...entity
      }
    };
  }

  mergeAll(state, entities) {
    return entities.reduce((memo, entity) => ({ ...memo, ...this.mergeOne(state, entity) }), {});
  }
}
