import { schema, add } from 'src/normalcy';
import { scenarios } from 'test/helpers';

export default () => {
  context('add(schema)', () => {
    it('should key the entity by id and replace sub-entities with ids', () => {
      const task = schema('task');
      const board = schema('board', { tasks: [task] });
      const reducer = add(board);
      const state = {};
      const payload = {
        id: 'board1',
        name: 'In Progress',
        tasks: [{
          id: 'task1',
        }, {
          id: 'task2'
        }]
      };

      reducer(state, payload).should.eql({
        board1: {
          id: 'board1',
          name: 'In Progress',
          tasks: ['task1', 'task2']
        }
      });
    });

      // context('with a string key', () => {
      //   const user = schema('user', 'user_id');
      //   const reducer = add(user);
      //   const state = {
      //     user1: {
      //       user_id: 'user1',
      //       isUser1: true
      //     }
      //   };
      //   const payload = {
      //     user_id: 'user2',
      //     isUser2: true
      //   };
      //   const expected = {
      //     user1: {
      //       user_id: 'user1',
      //       isUser1: true
      //     },
      //     user2: {
      //       user_id: 'user2',
      //       isUser2: true
      //     }
      //   };
      //
      //   scenarios(
      //     'should key an entity by the id passed in',
      //     'should key multiple entities by the id passed in',
      //     reducer, state, payload, expected
      //   );
      // });

      // context('with a function to generate a key', () => {
      //   const user = schema('user', (entity) => entity.user_id);
      //   const reducer = add(user);
      //   const state = {
      //     user1: {
      //       user_id: 'user1',
      //       isUser1: true
      //     }
      //   };
      //   const payload = {
      //     user_id: 'user2',
      //     isUser2: true
      //   };
      //   const expected = {
      //     user1: {
      //       user_id: 'user1',
      //       isUser1: true
      //     },
      //     user2: {
      //       user_id: 'user2',
      //       isUser2: true
      //     }
      //   };
      //
      //   scenarios(
      //     'should key an entity by the result of the function passed in',
      //     'should key multiple entities by the result of the function passed in',
      //     reducer, state, payload, expected
      //   );
      // });

      // context('and the particular reducer uses a different (string) key', () => {
      //   context('with the default id', () => {
      //     const user = schema('user');
      //     const reducer = add(user, 'user_id');
      //     const state = {
      //       user1: {
      //         id: 'user1',
      //         isUser1: true,
      //       }
      //     };
      //     const payload = {
      //       user_id: 'user2',
      //       isUser2: true
      //     };
      //     const expected = {
      //       user1: {
      //         id: 'user1',
      //         isUser1: true
      //       },
      //       user2: {
      //         id: 'user2',
      //         isUser2: true
      //       }
      //     };
      //
      //     scenarios(
      //       'should key the entity by reducer id and replace that id in the entity',
      //       'should key multiple entities by reducer id and replace that id in the entity',
      //       reducer, state, payload, expected
      //     );
      //   });
      //
      //   context('with a string key', () => {
      //     const user = schema('user', 'user_id');
      //     const reducer = add(user, 'user');
      //     const state = {
      //       user1: {
      //         user_id: 'user1',
      //         isUser1: true,
      //       }
      //     };
      //     const payload = {
      //       user: 'user2',
      //       isUser2: true
      //     };
      //     const expected = {
      //       user1: {
      //         user_id: 'user1',
      //         isUser1: true
      //       },
      //       user2: {
      //         user_id: 'user2',
      //         isUser2: true
      //       }
      //     };
      //
      //     scenarios(
      //       'should key the entity by reducer id and replace that id in the entity',
      //       'should key multiple entities by reducer id and replace that id in the entity',
      //       reducer, state, payload, expected
      //     );
      //   });
      // });
    });

    // context('and the schema has sub-schemas', () => {
    //   context('and the sub-schemas are keyed by the default id', () => {
    //     const user = schema('user');
    //     const post = schema('post', { meta: { authors: [{ creator: [user], editor: [user] }] }});
    //     const reducer = add(post);
    //     const state = {
    //       post1: {
    //         id: 'post1',
    //         isPost1: true,
    //         meta: {
    //           authors: [{
    //             creator: ['user1', 'user2'],
    //             editor: ['user3', 'user4']
    //           }],
    //           created: 'yesterday'
    //         }
    //       }
    //     };
    //     const payload = {
    //       id: 'post2',
    //       isPost2: true,
    //       meta: {
    //         authors: [{
    //           creator: [{
    //             id: 'user5',
    //             isUser5: true
    //           }, {
    //             id: 'user6',
    //             isUser6: true
    //           }],
    //           editor: [{
    //             id: 'user7',
    //             isUser7: true
    //           }, {
    //             id: 'user8',
    //             isUser8: true
    //           }]
    //         }],
    //         created: 'today'
    //       }
    //     };
    //     const expected = {
    //       post1: {
    //         id: 'post1',
    //         isPost1: true,
    //         meta: {
    //           authors: [{
    //             creator: ['user1', 'user2'],
    //             editor: ['user3', 'user4']
    //           }],
    //           created: 'yesterday'
    //         }
    //       },
    //       post2: {
    //         id: 'post2',
    //         isPost2: true,
    //         meta: {
    //           authors: [{
    //             creator: ['user5', 'user6'],
    //             editor: ['user7', 'user8']
    //           }],
    //           created: 'today'
    //         }
    //       }
    //     };
    //
    //     scenarios(
    //       'should key an entity by id and replace sub-entities with ids',
    //       'should key multiple entities by id and replace sub-entities with ids',
    //       reducer, state, payload, expected
    //     );
    //   });
    //
    //   context('and the sub-schemas are keyed by a string passed in', () => {
    //     const user = schema('user', 'user_id');
    //     const post = schema('post', { meta: { authors: [{ creator: [user], editor: [user] }] }});
    //     const reducer = add(post);
    //     const state = {
    //       post1: {
    //         id: 'post1',
    //         isPost1: true,
    //         meta: {
    //           authors: [{
    //             creator: ['user1', 'user2'],
    //             editor: ['user3', 'user4']
    //           }],
    //           created: 'yesterday'
    //         }
    //       }
    //     };
    //     const payload = {
    //       id: 'post2',
    //       isPost2: true,
    //       meta: {
    //         authors: [{
    //           creator: [{
    //             user_id: 'user5',
    //             isUser5: true
    //           }, {
    //             user_id: 'user6',
    //             isUser6: true
    //           }],
    //           editor: [{
    //             user_id: 'user7',
    //             isUser7: true
    //           }, {
    //             user_id: 'user8',
    //             isUser8: true
    //           }]
    //         }],
    //         created: 'today'
    //       }
    //     };
    //     const expected = {
    //       post1: {
    //         id: 'post1',
    //         isPost1: true,
    //         meta: {
    //           authors: [{
    //             creator: ['user1', 'user2'],
    //             editor: ['user3', 'user4']
    //           }],
    //           created: 'yesterday'
    //         }
    //       },
    //       post2: {
    //         id: 'post2',
    //         isPost2: true,
    //         meta: {
    //           authors: [{
    //             creator: ['user5', 'user6'],
    //             editor: ['user7', 'user8']
    //           }],
    //           created: 'today'
    //         }
    //       }
    //     };
    //
    //     scenarios(
    //       'should key an entity by id and replace sub-entities with the id field passed in',
    //       'should key multiple entities by id and replace sub-entities with the id field passed in',
    //       reducer, state, payload, expected
    //     );
    //   });
    //
    //   context('and the sub-schemas are keyed by a function passed in', () => {
    //     const user = schema('user', (entity) => entity.user_id);
    //     const post = schema('post', { meta: { authors: [{ creator: [user], editor: [user] }] }});
    //     const reducer = add(post);
    //     const state = {
    //       post1: {
    //         id: 'post1',
    //         isPost1: true,
    //         meta: {
    //           authors: [{
    //             creator: ['user1', 'user2'],
    //             editor: ['user3', 'user4']
    //           }],
    //           created: 'yesterday'
    //         }
    //       }
    //     };
    //     const payload = {
    //       id: 'post2',
    //       isPost2: true,
    //       meta: {
    //         authors: [{
    //           creator: [{
    //             user_id: 'user5',
    //             isUser5: true
    //           }, {
    //             user_id: 'user6',
    //             isUser6: true
    //           }],
    //           editor: [{
    //             user_id: 'user7',
    //             isUser7: true
    //           }, {
    //             user_id: 'user8',
    //             isUser8: true
    //           }]
    //         }],
    //         created: 'today'
    //       }
    //     };
    //     const expected = {
    //       post1: {
    //         id: 'post1',
    //         isPost1: true,
    //         meta: {
    //           authors: [{
    //             creator: ['user1', 'user2'],
    //             editor: ['user3', 'user4']
    //           }],
    //           created: 'yesterday'
    //         }
    //       },
    //       post2: {
    //         id: 'post2',
    //         isPost2: true,
    //         meta: {
    //           authors: [{
    //             creator: ['user5', 'user6'],
    //             editor: ['user7', 'user8']
    //           }],
    //           created: 'today'
    //         }
    //       }
    //     };
    //
    //     scenarios(
    //       'should key an entity by id and replace sub-entities by the function passed in',
    //       'should key multiple entities by id and replace sub-entities by the function passed in',
    //       reducer, state, payload, expected
    //     );
    //   });
    // });
  // });
};
