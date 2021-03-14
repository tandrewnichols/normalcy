import { schema, add } from 'src/normalcy';
import { scenarios } from 'test/helpers';

export default () => {
  context('add(schema).from(otherSchema)', () => {
    context('with the default id', () => {
      const user = schema('user');
      const post = schema('post', { author: user });
      const reducer = add(user).from(post);
      const state = {
        user1: {
          id: 'user1',
          isUser1: true
        }
      };
      const payload = {
        id: 'post2',
        isPost2: true,
        author: {
          id: 'user2',
          isUser2: true
        }
      };
      const expected = {
        user1: {
          id: 'user1',
          isUser1: true
        },
        user2: {
          id: 'user2',
          isUser2: true
        }
      };

      scenarios(
        'should key the sub-entity by id',
        'should key multiple entities by id',
        reducer, state, payload, expected
      );

      it('should ignore entities that are missing a prop', () => {
        const user = schema('user');
        const post = schema('post', { author: user });
        const state = {
          user1: {
            id: 'user1',
            isUser1: true
          }
        };
        const payload = {
          id: 'post2',
          isPost2: true
        };

        const reducer = add(user).from(post);
        reducer(state, payload).should.eql({
          user1: {
            id: 'user1',
            isUser1: true
          }
        });
      });
    });

    context('with a string key', () => {
      const user = schema('user', 'user_id');
      const post = schema('post', { author: user });
      const reducer = add(user).from(post);
      const state = {
        user1: {
          user_id: 'user1',
          isUser1: true
        }
      };
      const payload = {
        id: 'post2',
        isPost2: true,
        author: {
          user_id: 'user2',
          isUser2: true
        }
      };
      const expected = {
        user1: {
          user_id: 'user1',
          isUser1: true
        },
        user2: {
          user_id: 'user2',
          isUser2: true
        }
      };

      scenarios(
        'should key the sub-entity by id',
        'should key multiple entities by id',
        reducer, state, payload, expected
      );

      it('should ignore entities that are missing a prop', () => {
        const user = schema('user');
        const post = schema('post', { author: user });
        const state = {
          user1: {
            user_id: 'user1',
            isUser1: true
          }
        };
        const payload = {
          id: 'post2',
          isPost2: true
        };

        const reducer = add(user).from(post);
        reducer(state, payload).should.eql({
          user1: {
            user_id: 'user1',
            isUser1: true
          }
        });
      });
    });

    context('with a function to generate a key', () => {
      const user = schema('user', (entity) => entity.user_id);
      const post = schema('post', { author: user });
      const reducer = add(user).from(post);
      const state = {
        user1: {
          user_id: 'user1',
          isUser1: true
        }
      };
      const payload = {
        id: 'post2',
        isPost2: true,
        author: {
          user_id: 'user2',
          isUser2: true
        }
      };
      const expected = {
        user1: {
          user_id: 'user1',
          isUser1: true
        },
        user2: {
          user_id: 'user2',
          isUser2: true
        }
      };

      scenarios(
        'should key the sub-entity by id',
        'should key multiple entities by id',
        reducer, state, payload, expected
      );

      it('should ignore entities that are missing a prop', () => {
        const user = schema('user');
        const post = schema('post', { author: user });
        const state = {
          user1: {
            user_id: 'user1',
            isUser1: true
          }
        };
        const payload = {
          id: 'post2',
          isPost2: true
        };

        const reducer = add(user).from(post);
        reducer(state, payload).should.eql({
          user1: {
            user_id: 'user1',
            isUser1: true
          }
        });
      });
    });
  });
};
