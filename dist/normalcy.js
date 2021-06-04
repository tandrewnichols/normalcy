(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["normalcy"] = factory();
	else
		root["normalcy"] = factory();
})(self, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "add": () => (/* binding */ add),
  "compose": () => (/* binding */ compose),
  "default": () => (/* binding */ normalcy),
  "merge": () => (/* binding */ merge),
  "remove": () => (/* binding */ remove),
  "schema": () => (/* binding */ schema)
});

;// CONCATENATED MODULE: ./src/schema.js
const isArr = Array.isArray.bind(Array);

class Schema {
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

;// CONCATENATED MODULE: ./src/shapeful-schema.js


class ShapefulSchema extends Schema {
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

;// CONCATENATED MODULE: ./src/normalcy.js



const schema = (name, shape, id) => {
  if (typeof shape === 'string' || typeof shape === 'function') {
    id = shape;
    shape = null;
  }

  id ||= 'id';

  if (shape) {
    return new ShapefulSchema(name, id, shape);
  } else {
    return new Schema(name, id);
  }
};

const add = (schema, reducerId) => {
  const reducer = (state, payload) => {
    return {
      ...state,
      ...schema.normalize(payload, reducerId)
    };
  };

  reducer.from = (parentSchema) => (state, payload) => {
    return {
      ...state,
      ...parentSchema.findAndNorm(schema, payload)
    };
  };

  reducer.to = (parentSchema, id, disambiguation) => (state, payload) => {
    return {
      ...state,
      ...parentSchema.findAndAdd(payload, state, schema, id, reducerId, disambiguation)
    };
  };

  return reducer;
};

const remove = (schema, reducerId) => {
  const reducer = (state, payload) => {
    return schema.remove(state, payload, reducerId);
  };

  reducer.from = (parentSchema, id, disambiguation) => (state, payload) => {
    return parentSchema.findAndRemove(payload, state, schema, id, reducerId, disambiguation)
  };

  return reducer;
};

const merge = (schema) => (state, payload) => {
  return schema.merge(state, payload);
};

const compose = (...reducers) => (state, payload) => {
  return reducers.reduce((memo, reducer) => reducer(memo, payload), state);
};

/* harmony default export */ const normalcy = ({ schema, add });

/******/ 	return __webpack_exports__;
/******/ })()
;
});