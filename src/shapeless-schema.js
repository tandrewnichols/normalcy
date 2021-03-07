import Schema from './schema';

export default class ShapelessSchema extends Schema {
  normalizeOne(entity) {
    return this.keyById(entity);
  }
}
