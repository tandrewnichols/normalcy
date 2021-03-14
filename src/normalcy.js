import ShapefulSchema from './shapeful-schema';
import Schema from './schema';

export const schema = (name, shape, id) => {
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

export const add = (schema) => {
  const reducer = (state, payload) => {
    return {
      ...state,
      ...schema.normalize(payload)
    };
  };

  reducer.from = (parentSchema) => (state, payload) => {
    return {
      ...state,
      ...parentSchema.findAndNorm(schema, payload)
    };
  };

  reducer.to = (parentSchema) => {
    const innerReducer = (state, payload) => {
      return {
        ...state,
        ...parentSchema.findAndAdd(state, schema, payload)
      };
    };

    innerReducer.by = (id) => (state, payload) => {
      return {
        ...state,
        ...parentSchema.findAndAddById(state, schema, payload, id)
      };
    };

    return innerReducer;
  };

  return reducer;
};

export const remove = (schema) => {
  const reducer = (state, payload) => {
    return schema.remove(state, payload);
  };

  reducer.from = (parentSchema) => {
    const innerReducer = (state, payload) => {
      return parentSchema.findAndRemove(state, schema, payload)
    };

    innerReducer.by = (id) => (state, payload) => {
      return parentSchema.findAndRemoveById(state, schema, payload, id);
    };

    return innerReducer;
  };

  return reducer;
};

export default { schema, add };
