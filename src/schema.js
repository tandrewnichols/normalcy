const isArr = Array.isArray.bind(Array);

export default class Schema {
  constructor(name, id) {
    this.name = name;
    this.id = id;
  }

  is(name) {
    return name === this.name; 
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
    return isArr(entity) ? this.normalizeAll(entity) : this.normalizeOne(entity);
  }

  normalizeOne(entity) {
    return this.keyById(entity);
  }

  normalizeAll(entities) {
    return entities.reduce((memo, entity) => ({ ...memo, ...this.normalizeOne(entity) }), {});
  }

  reduceEntities(state, subSchema, entities, fn, id) {
    return entities.reduce((memo, entity) => ({ ...memo, ...fn(state, subSchema, entity, id) }), {});
  }

  findAndAdd(state, subSchema, entity, id) {
    const fn = isArr(entity) ? 'findAndAddAll' : 'findAndAddOne';
    return this[fn](state, subSchema, entity, id);
  }

  findAndAddOne(state, subSchema, entity, id) {
    const recurse = (currentState, currentShape, currentEntity) => {
      for (let [key, val] of Object.entries(currentShape)) {
        if (val instanceof Schema && val.is(subSchema.name)) {
          return {
            ...currentState,
            [key]: val.getId(currentEntity)
          };
        }

        if (isArr(val) && val[0] instanceof Schema && val[0].is(subSchema.name)) {
          if (!currentState[key]) {
            return {
              ...currentState,
              [key]: [ val[0].getId(currentEntity) ]
            };
          }

          return {
            ...currentState,
            [key]: [ ...currentState[key], val[0].getId(currentEntity) ]
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

  findAndAddAll(state, subSchema, entities, id) {
    return this.reduceEntities(state, subSchema, entities, this.findAndAddOne.bind(this), id);
  }

  remove(state, entity) {
    const fn = isArr(entity) ? 'removeAll' : 'removeOne';
    return this[fn](state, entity);
  }

  removeOne(state, entity) {
    const { [this.getId(entity)]: removed, ...newState } = state;
    return { ...newState };
  }

  removeAll(state, entities) {
    return entities.reduce((memo, entity) => this.removeOne(memo, entity), state);
  }

  findAndRemove(state, subSchema, entity, id) {
    const fn = isArr(entity) ? 'findAndRemoveAll' : 'findAndRemoveOne';
    return this[fn](state, subSchema, entity, id);
  }

  findAndRemoveOne(state, subSchema, entity, id) {
    const recurse = (currentState, currentShape, currentEntity) => {
      for (let [key, val] of Object.entries(currentShape)) {
        if (val instanceof Schema && val.is(subSchema.name) && currentState[key] === val.getId(currentEntity)) {
          const { [key]: removed, ...newState } = currentState;
          return { ...newState };
        }

        if (isArr(val) && isArr(currentState[key]) && val[0] instanceof Schema && val[0].is(subSchema.name)) {
          const id = val[0].getId(currentEntity);

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

  findAndRemoveAll(state, subSchema, entities, id) {
    return this.reduceEntities(state, subSchema, entities, this.findAndRemoveOne.bind(this), id);
  }
}
