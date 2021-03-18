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

    context('with a reducer id for the sub-schema', () => {
      context('and a key/value pair', () => {
        const user = schema('user');
        const post = schema('post', { author: user });
        const reducer = remove(user, 'user_id').from(post, 'post_id');
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
          post_id: 'post1',
          user_id: 'user1',
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
          'should remove a sub-entity by id from a flat payload by reducer id',
          'should remove multiple sub-entities by id from a flat payload by reducer id',
          reducer, state, payload, expected
        );
      });

      context('and a list of sub-schemas', () => {
        const user = schema('user');
        const post = schema('post', { authors: [user] });
        const reducer = remove(user, 'user_id').from(post, 'post_id');
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
          user_id: 'user2',
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
          'should remove a sub-entity by id from a list by the reducer id',
          'should remove multiple sub-entities by id from a list by the reducer id',
          reducer, state, payload, expected
        );
      });
    });
    context('with multiple sub-schemas of the same type', () => {
      context('with a single-segment string', () => {
        const user = schema('user');
        const post = schema('post', { authors: [user], editors: [user] });
        const reducer = remove(user).from(post, 'post_id', 'editors');
        const state = {
          post1: {
            id: 'post1',
            isPost1: true,
            authors: ['user1', 'user2'],
            editors: ['user3', 'user4']
          },
          post2: {
            id: 'post2',
            isPost2: true,
            authors: ['user1', 'user2'],
            editors: ['user3', 'user4']
          }
        };
        const payload = {
          post_id: 'post1',
          id: 'user3'
        };
        const expected = {
          post1: {
            id: 'post1',
            isPost1: true,
            authors: ['user1', 'user2'],
            editors: ['user4']
          },
          post2: {
            id: 'post2',
            isPost2: true,
            authors: ['user1', 'user2'],
            editors: ['user3', 'user4']
          }
        };

        scenarios(
          'should remove a sub-entity by id from the correct entity',
          'should remove multiple sub-entities by id from the correct entity',
          reducer, state, payload, expected
        );
      });

      context('with a multi-segment string', () => {
        const user = schema('user');
        const post = schema('post', { creator: { author: user }, editor: { author: user }});
        const reducer = remove(user).from(post, 'post_id', 'editor.author');
        const state = {
          post1: {
            id: 'post1',
            isPost1: true,
            creator: {
              author: 'user1',
            },
            editor: {
              author: 'user2'
            }
          },
          post2: {
            id: 'post2',
            isPost2: true,
            creator: {
              author: 'user1',
            },
            editor: {
              author: 'user2'
            }
          }
        };
        const payload = {
          post_id: 'post1',
          id: 'user2'
        };
        const expected = {
          post1: {
            id: 'post1',
            isPost1: true,
            creator: {
              author: 'user1'
            },
            editor: {}
          },
          post2: {
            id: 'post2',
            isPost2: true,
            creator: {
              author: 'user1',
            },
            editor: {
              author: 'user2'
            }
          }
        };

        scenarios(
          'should remove a sub-entity by id from the correct entity',
          'should remove multiple sub-entities by id from the correct entity',
          reducer, state, payload, expected
        );
      });

      context('with an array', () => {
        const user = schema('user');
        const post = schema('post', { creator: { author: user }, editor: { author: user }});
        const reducer = remove(user).from(post, 'post_id', ['editor', 'author']);
        const state = {
          post1: {
            id: 'post1',
            isPost1: true,
            creator: {
              author: 'user1',
            },
            editor: {
              author: 'user2'
            }
          },
          post2: {
            id: 'post2',
            isPost2: true,
            creator: {
              author: 'user1',
            },
            editor: {
              author: 'user2'
            }
          }
        };
        const payload = {
          post_id: 'post1',
          id: 'user2'
        };
        const expected = {
          post1: {
            id: 'post1',
            isPost1: true,
            creator: {
              author: 'user1'
            },
            editor: {}
          },
          post2: {
            id: 'post2',
            isPost2: true,
            creator: {
              author: 'user1',
            },
            editor: {
              author: 'user2'
            }
          }
        };

        scenarios(
          'should remove a sub-entity by id from the correct entity',
          'should remove multiple sub-entities by id from the correct entity',
          reducer, state, payload, expected
        );
      });

      context('with a function that returns a multi-segment string', () => {
        const user = schema('user');
        const post = schema('post', { creator: { author: user }, editor: { author: user }});
        const reducer = remove(user).from(post, 'post_id', (entity) => `${ entity.type }.author`);
        const state = {
          post1: {
            id: 'post1',
            isPost1: true,
            creator: {
              author: 'user1',
            },
            editor: {
              author: 'user2'
            }
          },
          post2: {
            id: 'post2',
            isPost2: true,
            creator: {
              author: 'user1',
            },
            editor: {
              author: 'user2'
            }
          }
        };
        const payload = {
          post_id: 'post1',
          id: 'user2',
          type: 'editor'
        };
        const expected = {
          post1: {
            id: 'post1',
            isPost1: true,
            creator: {
              author: 'user1'
            },
            editor: {}
          },
          post2: {
            id: 'post2',
            isPost2: true,
            creator: {
              author: 'user1',
            },
            editor: {
              author: 'user2'
            }
          }
        };

        scenarios(
          'should remove a sub-entity by id from the correct entity',
          'should remove multiple sub-entities by id from the correct entity',
          reducer, state, payload, expected
        );
      });

      context('with a function that returns an array', () => {
        const user = schema('user');
        const post = schema('post', { creator: { author: user }, editor: { author: user }});
        const reducer = remove(user).from(post, 'post_id', (entity) => [entity.type, 'author']);
        const state = {
          post1: {
            id: 'post1',
            isPost1: true,
            creator: {
              author: 'user1',
            },
            editor: {
              author: 'user2'
            }
          },
          post2: {
            id: 'post2',
            isPost2: true,
            creator: {
              author: 'user1',
            },
            editor: {
              author: 'user2'
            }
          }
        };
        const payload = {
          post_id: 'post1',
          id: 'user2',
          type: 'editor'
        };
        const expected = {
          post1: {
            id: 'post1',
            isPost1: true,
            creator: {
              author: 'user1'
            },
            editor: {}
          },
          post2: {
            id: 'post2',
            isPost2: true,
            creator: {
              author: 'user1',
            },
            editor: {
              author: 'user2'
            }
          }
        };

        scenarios(
          'should remove a sub-entity by id from the correct entity',
          'should remove multiple sub-entities by id from the correct entity',
          reducer, state, payload, expected
        );
      });
    });
  });
};
