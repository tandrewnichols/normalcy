import { schema, remove } from 'src/normalcy';
import { scenarios } from 'test/helpers';

export default () => {
  context('remove(schema)', () => {
    context('with the default id', () => {
      const user = schema('user');
      const reducer = remove(user);
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
        id: 'user2',
        isUser2: true
      };
      const expected = {
        user1: {
          id: 'user1',
          isUser1: true
        }
      };

      scenarios(
        'should remove an entity by id',
        'should remove multiple entities by id',
        reducer, state, payload, expected
      );
    });

    context('with a string key', () => {
      const user = schema('user', 'user_id');
      const reducer = remove(user);
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
        user_id: 'user2',
        isUser2: true
      };
      const expected = {
        user1: {
          user_id: 'user1',
          isUser1: true
        }
      };

      scenarios(
        'should remove an entity by the id passed in',
        'should remove multiple entities by the id passed in',
        reducer, state, payload, expected
      );
    });

    context('with a function to generate a key', () => {
      const user = schema('user', (entity) => entity.user_id);
      const reducer = remove(user);
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
        user_id: 'user2',
        isUser2: true
      };
      const expected = {
        user1: {
          user_id: 'user1',
          isUser1: true
        }
      };

      scenarios(
        'should remove an entity by the id passed in',
        'should remove multiple entities by the id passed in',
        reducer, state, payload, expected
      );
    });

    context('when the id isn\'t in the state', () => {
      const user = schema('user', (entity) => entity.user_id);
      const reducer = remove(user);
      const state = {
        user1: {
          user_id: 'user1',
          isUser1: true
        }
      };
      const payload = {
        user_id: 'user2',
        isUser2: true
      };
      const expected = {
        user1: {
          user_id: 'user1',
          isUser1: true
        }
      };

      scenarios(
        'should remove an entity by the id passed in',
        'should remove multiple entities by the id passed in',
        reducer, state, payload, expected
      );
    });

    context('and the particular reducer uses a different key', () => {
      context('with the default id', () => {
        const user = schema('user');
        const reducer = remove(user, 'user_id');
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
          user_id: 'user2',
          isUser2: true
        };
        const expected = {
          user1: {
            id: 'user1',
            isUser1: true
          }
        };

        scenarios(
          'should remove an entity by the reducer id',
          'should remove multiple entities by the reducer id',
          reducer, state, payload, expected
        );
      });

      context('with a string key', () => {
        const user = schema('user', 'user_id');
        const reducer = remove(user, 'user');
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
          user: 'user2',
          isUser2: true
        };
        const expected = {
          user1: {
            user_id: 'user1',
            isUser1: true
          }
        };

        scenarios(
          'should remove an entity by the reducer id',
          'should remove multiple entities by the reducer id',
          reducer, state, payload, expected
        );
      });
    });
  });
};
