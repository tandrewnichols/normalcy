import { schema, add } from 'src/normalcy';
import { scenarios } from 'test/helpers';

export default () => {
  context('add(schema).to(otherSchema)', () => {
    context('and a key/value pair', () => {
      context('and the property isn\'t there yet', () => {
        context('with the default id', () => {
          const user = schema('user');
          const post = schema('post', { author: user });
          const reducer = add(user).to(post);
          const state = {
            post1: {
              id: 'post1',
              isPost1: true
            },
            post2: {
              id: 'post2',
              isPost2: true
            }
          };
          const payload = {
            id: 'post1',
            author: {
              id: 'user1',
              isUser1: true
            }
          };
          const expected = {
            post1: {
              id: 'post1',
              isPost1: true,
              author: 'user1'
            },
            post2: {
              id: 'post2',
              isPost2: true
            }
          };

          scenarios(
            'should add the key/value to the entity',
            'should add multiple key/values to the entity',
            reducer, state, payload, expected
          );
        });

        context('with a string key', () => {
          const user = schema('user', 'user_id');
          const post = schema('post', { author: user });
          const reducer = add(user).to(post);
          const state = {
            post1: {
              id: 'post1',
              isPost1: true
            }
          };
          const payload = {
            id: 'post1',
            author: {
              user_id: 'user1',
              isUser1: true
            }
          };
          const expected = {
            post1: {
              id: 'post1',
              isPost1: true,
              author: 'user1'
            }
          };

          scenarios(
            'should add the key/value to the entity',
            'should add multiple key/values to the entity',
            reducer, state, payload, expected
          );
        });

        context('with a function that generates a key', () => {
          const user = schema('user', (entity) => entity.user_id);
          const post = schema('post', { author: user });
          const reducer = add(user).to(post);
          const state = {
            post1: {
              id: 'post1',
              isPost1: true
            }
          };
          const payload = {
            id: 'post1',
            author: {
              user_id: 'user1',
              isUser1: true
            }
          };
          const expected = {
            post1: {
              id: 'post1',
              isPost1: true,
              author: 'user1'
            }
          };

          scenarios(
            'should add the key/value to the entity',
            'should add multiple key/values to the entity',
            reducer, state, payload, expected
          );
        });
      });

      context('and the property is already there', () => {
        const user = schema('user');
        const post = schema('post', { author: user });
        const reducer = add(user).to(post);
        const state = {
          post1: {
            id: 'post1',
            isPost1: true,
            author: 'user2'
          }
        };
        const payload = {
          id: 'post1',
          author: {
            id: 'user1',
            isUser1: true
          }
        };
        const expected = {
          post1: {
            id: 'post1',
            isPost1: true,
            author: 'user1'
          }
        };

        scenarios(
          'should add the key/value to the entity',
          'should add multiple key/values to the entity',
          reducer, state, payload, expected
        );
      });
    });

    context('and a list of strings', () => {
      context('and the property isn\'t there yet', () => {
        const user = schema('user');
        const post = schema('post', { authors: [user] });
        const reducer = add(user).to(post);
        const state = {
          post1: {
            id: 'post1',
            isPost1: true
          }
        };
        const payload = {
          id: 'post1',
          authors: [{
            id: 'user1',
            isUser1: true
          }]
        };
        const expected = {
          post1: {
            id: 'post1',
            isPost1: true,
            authors: ['user1']
          }
        };

        scenarios(
          'should add string to the list',
          'should add multiple strings to the list',
          reducer, state, payload, expected
        );
      });

      context('and the property is already there', () => {
        const user = schema('user');
        const post = schema('post', { authors: [user] });
        const reducer = add(user).to(post);
        const state = {
          post1: {
            id: 'post1',
            isPost1: true,
            authors: ['user1']
          }
        };
        const payload = {
          id: 'post1',
          authors: [{
            id: 'user2',
            isUser1: true
          }]
        };
        const expected = {
          post1: {
            id: 'post1',
            isPost1: true,
            authors: ['user1', 'user2']
          }
        };

        scenarios(
          'should replace the key/value in the entity',
          'should replace multiple key/values in the entity',
          reducer, state, payload, expected
        );
      });
    });

    context('and a nested shape', () => {
      const user = schema('user');
      const post = schema('post', { meta: { authors: [user] }});
      const reducer = add(user).to(post);
      const state = {
        post1: {
          id: 'post1',
          isPost1: true,
          meta: {
            authors: ['user1']
          }
        }
      };
      const payload = {
        id: 'post1',
        meta: {
          authors: [{
            id: 'user2',
            isUser2: true
          }]
        }
      };
      const expected = {
        post1: {
          id: 'post1',
          isPost1: true,
          meta: {
            authors: ['user1', 'user2']
          }
        }
      };

      scenarios(
        'should add the string to the list',
        'should add multiple strings to the list',
        reducer, state, payload, expected
      );
    });
  });
};
