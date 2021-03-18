import { schema, merge } from 'src/normalcy';
import { scenarios } from 'test/helpers';

export default () => {
  context('merge(schema)', () => {
    context('with the default id', () => {
      const user = schema('user');
      const reducer = merge(user);
      const state = {
        user1: {
          id: 'user1',
          isUser1: true
        },
        user2: {
          id: 'user2',
          isUser2: true
        }
      };
      const payload = {
        id: 'user1',
        newProp: true
      };
      const expected = {
        user1: {
          id: 'user1',
          isUser1: true,
          newProp: true
        },
        user2: {
          id: 'user2',
          isUser2: true
        }
      };

      scenarios(
        'should merge the entity with the existing one',
        'should merge multiple entities with existing ones',
        reducer, state, payload, expected
      );
    });

    context('with a string key', () => {
      const user = schema('user', 'user_id');
      const reducer = merge(user);
      const state = {
        user1: {
          user_id: 'user1',
          isUser1: true
        },
        user2: {
          user_id: 'user2',
          isUser2: true
        }
      };
      const payload = {
        user_id: 'user1',
        newProp: true
      };
      const expected = {
        user1: {
          user_id: 'user1',
          isUser1: true,
          newProp: true
        },
        user2: {
          user_id: 'user2',
          isUser2: true
        }
      };

      scenarios(
        'should merge the entity with the existing one by the key passed in',
        'should merge multiple entities with existing ones by the key passed in',
        reducer, state, payload, expected
      );
    });

    context('with a function to generate  key', () => {
      const user = schema('user', (entity) => entity.user_id);
      const reducer = merge(user);
      const state = {
        user1: {
          user_id: 'user1',
          isUser1: true
        },
        user2: {
          user_id: 'user2',
          isUser2: true
        }
      };
      const payload = {
        user_id: 'user1',
        newProp: true
      };
      const expected = {
        user1: {
          user_id: 'user1',
          isUser1: true,
          newProp: true
        },
        user2: {
          user_id: 'user2',
          isUser2: true
        }
      };

      scenarios(
        'should merge the entity with the existing one by the result of the function passed in',
        'should merge multiple entities with existing ones by the result of the function passed in',
        reducer, state, payload, expected
      );
    });
  });
};
