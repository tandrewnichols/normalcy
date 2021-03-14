import { schema, remove } from 'src/normalcy';
import { scenarios } from 'test/helpers';

export default () => {
  context('remove(schema).from(otherSchema)', () => {
    context('with the same shape', () => {
      context('with a key/value pair', () => {
        context('and the default id', () => {
          const user = schema('user');
          const post = schema('post', { author: user });
          const reducer = remove(user).from(post);
          const state = {
            post1: {
              id: 'post1',
              isPost1: true,
              author: 'user1'
            },
            post2: {
              id: 'post2',
              isPost2: true,
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
              isPost1: true
            },
            post2: {
              id: 'post2',
              isPost2: true,
              author: 'user2'
            }
          };

          scenarios(
            'should remove a sub-entity by id',
            'should remove multiple sub-entities by id',
            reducer, state, payload, expected
          );
        });

        context('and a string id', () => {
          const user = schema('user', 'user_id');
          const post = schema('post', { author: user });
          const reducer = remove(user).from(post);
          const state = {
            post1: {
              id: 'post1',
              isPost1: true,
              author: 'user1'
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
              isPost1: true
            }
          };

          scenarios(
            'should remove a sub-entity by id',
            'should remove multiple sub-entities by id',
            reducer, state, payload, expected
          );
        });

        context('and a function to generate a key', () => {
          const user = schema('user', (entity) => entity.user_id);
          const post = schema('post', { author: user });
          const reducer = remove(user).from(post);
          const state = {
            post1: {
              id: 'post1',
              isPost1: true,
              author: 'user1'
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
              isPost1: true
            }
          };

          scenarios(
            'should remove a sub-entity by id',
            'should remove multiple sub-entities by id',
            reducer, state, payload, expected
          );
        });
      });

      context('with a list of ids', () => {
        context('and the default id', () => {
          const user = schema('user');
          const post = schema('post', { authors: [user] });
          const reducer = remove(user).from(post);
          const state = {
            post1: {
              id: 'post1',
              isPost1: true,
              authors: ['user1', 'user2']
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
              authors: ['user1']
            }
          };

          scenarios(
            'should remove a sub-entity by id',
            'should remove multiple sub-entities by id',
            reducer, state, payload, expected
          );
        });

        context('and the id is not in the list', () => {
          const user = schema('user');
          const post = schema('post', { authors: [user] });
          const reducer = remove(user).from(post);
          const state = {
            post1: {
              id: 'post1',
              isPost1: true,
              authors: ['user1', 'user2']
            }
          };
          const payload = {
            id: 'post1',
            authors: [{
              id: 'user3',
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
            'should remove a sub-entity by id',
            'should remove multiple sub-entities by id',
            reducer, state, payload, expected
          );
        });

        context('and a string id', () => {
          const user = schema('user', 'user_id');
          const post = schema('post', { authors: [user] });
          const reducer = remove(user).from(post);
          const state = {
            post1: {
              id: 'post1',
              isPost1: true,
              authors: ['user1', 'user2']
            }
          };
          const payload = {
            id: 'post1',
            authors: [{
              user_id: 'user2',
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
            'should remove a sub-entity by id',
            'should remove multiple sub-entities by id',
            reducer, state, payload, expected
          );
        });

        context('and a function to generates a key', () => {
          const user = schema('user', (entity) => entity.user_id);
          const post = schema('post', { authors: [user] });
          const reducer = remove(user).from(post);
          const state = {
            post1: {
              id: 'post1',
              isPost1: true,
              authors: ['user1', 'user2']
            }
          };
          const payload = {
            id: 'post1',
            authors: [{
              user_id: 'user2',
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
            'should remove a sub-entity by id',
            'should remove multiple sub-entities by id',
            reducer, state, payload, expected
          );
        });
      });

      context('with a nested property', () => {
        context('an a key/value pair', () => {
          const user = schema('user');
          const post = schema('post', { meta: { author: user }});
          const reducer = remove(user).from(post);
          const state = {
            post1: {
              id: 'post1',
              isPost1: true,
              meta: {
                author: 'user1'
              }
            }
          };
          const payload = {
            id: 'post1',
            meta: {
              author: {
                id: 'user1',
                isUser1: true
              }
            }
          };
          const expected = {
            post1: {
              id: 'post1',
              isPost1: true,
              meta: {}
            }
          };

          scenarios(
            'should remove a sub-entity by id',
            'should remove multiple sub-entities by id',
            reducer, state, payload, expected
          );
        });

        context('an a list of ids', () => {
          const user = schema('user');
          const post = schema('post', { meta: { authors: [user] }});
          const reducer = remove(user).from(post);
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
                id: 'user1',
                isUser1: true
              }]
            }
          };
          const expected = {
            post1: {
              id: 'post1',
              isPost1: true,
              meta: {
                authors: []
              }
            }
          };

          scenarios(
            'should remove a sub-entity by id',
            'should remove multiple sub-entities by id',
            reducer, state, payload, expected
          );
        });
      });
    });

    context('with a flat shape', () => {
      context('with a string key', () => {
        const user = schema('user');
        const post = schema('post', { authors: [user] });
        const reducer = remove(user).from(post).by('post_id');
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
        const reducer = remove(user).from(post).by((entity) => entity.post_id);
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
  });
};
