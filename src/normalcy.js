import ShapefulSchema from './shapeful-schema';
import ShapelessSchema from './shapeless-schema';

export const schema = (name, shape, id) => {
  if (typeof shape === 'string' || typeof shape === 'function') {
    id = shape;
    shape = null;
  }

  id ||= 'id';

  if (shape) {
    return new ShapefulSchema(name, id, shape);
  } else {
    return new ShapelessSchema(name, id);
  }
};

export const add = (schema, parentSchema) => (state, payload) => {
  return {
    ...state,
    ...schema.normalize(payload)
  };
};

export default { schema, add };
