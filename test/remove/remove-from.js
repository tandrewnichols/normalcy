import { schema, remove } from 'src/normalcy';
import { scenarios } from 'test/helpers';

export default () => {
  context('remove(schema).from(otherSchema)', () => {
    context('with a string key', () => {
      const user = schema('user');
      const post = schema('post', { authors: [user] });
      const reducer = remove(user).from(post, 'post_id');
      const state = {
        post1: {
          id: 'post1',
          isPost1: true,
          authors: ['user1', 'user2']
        },
        post2: {
          id: 'post2',
          isPost2: true,
          authors: ['user1', 'user2']
        }
      };
      const payload = {
        post_id: 'post1',
        id: 'user2',
      };
      const expected = {
        post1: {
          id: 'post1',
          isPost1: true,
          authors: ['user1']
        },
        post2: {
          id: 'post2',
          isPost2: true,
          authors: ['user1', 'user2']
        }
      };

      scenarios(
        'should remove a sub-entity by id from a flat payload',
        'should remove multiple sub-entities by id from a flat payload',
        reducer, state, payload, expected
      );
    });

    context('with a function that generates a key', () => {
      const user = schema('user');
      const post = schema('post', { authors: [user] });
      const reducer = remove(user).from(post, (entity) => entity.post_id);
      const state = {
        post1: {
          id: 'post1',
          isPost1: true,
          authors: ['user1', 'user2']
        },
        post2: {
          id: 'post2',
          isPost2: true,
          authors: ['user1', 'user2']
        }
      };
      const payload = {
        post_id: 'post1',
        id: 'user2',
      };
      const expected = {
        post1: {
          id: 'post1',
          isPost1: true,
          authors: ['user1']
        },
        post2: {
          id: 'post2',
          isPost2: true,
          authors: ['user1', 'user2']
        }
      };

      scenarios(
        'should remove a sub-entity by id from a flat payload',
        'should remove multiple sub-entities by id from a flat payload',
        reducer, state, payload, expected
      );
    });
  });
};
