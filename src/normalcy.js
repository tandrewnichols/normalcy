import Schema from './schema';

export const schema = (name, shape, id) => {
  if (typeof shape === 'string' || typeof shape === 'function') {
    id = shape;
    shape = null;
  }

  id ||= 'id';

  return new Schema(name, id, shape);
};

export const add = (schema) => {
  const args = { schema };

  const reducer = (state, payload) => {
    return {
      ...state,
      ...schema.normalize(payload)
    };
  };

  reducer.by = (schemaProp) => {
    if (args.parentSchema) {
      args.parentProp = prop;
    } else {
      args.schemaProp = prop;
    }

    return this;
  };

  reducer.from = (parentSchema) => {
    args.parentSchema = parentSchema;
    return this;
  };

  reducer.to = (parentSchema) => {
    args.parentSchema = parentSchema;
    return this;
  };

  reducer.on = (disambiguation) => {
    args.disambiguation = disambiguation;
    return this;
  };

  return reducer;
};
// export const add = (schema, reducerId) => {
//   const reducer = (state, payload) => {
//     return {
//       ...state,
//       ...schema.normalize(payload, reducerId)
//     };
//   };
//
//   reducer.from = (parentSchema) => (state, payload) => {
//     return {
//       ...state,
//       ...parentSchema.findAndNorm(schema, payload)
//     };
//   };
//
//   reducer.to = (parentSchema, id, disambiguation) => (state, payload) => {
//     return {
//       ...state,
//       ...parentSchema.findAndAdd(payload, state, schema, id, reducerId, disambiguation)
//     };
//   };
//
//   return reducer;
// };

export const remove = (schema, reducerId) => {
  const reducer = (state, payload) => {
    return schema.remove(state, payload, reducerId);
  };

  reducer.from = (parentSchema, id, disambiguation) => (state, payload) => {
    return parentSchema.findAndRemove(payload, state, schema, id, reducerId, disambiguation)
  };

  return reducer;
};

export const merge = (schema) => (state, payload) => {
  return schema.merge(state, payload);
};

export const compose = (...reducers) => (state, payload) => {
  return reducers.reduce((memo, reducer) => reducer(memo, payload), state);
};

export default { schema, add };
