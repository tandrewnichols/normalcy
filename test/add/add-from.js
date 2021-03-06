import { schema, add } from 'src/normalcy';
import { scenarios } from 'test/helpers';

export default () => {
  // context('add(schema).from(otherSchema)', () => {
  //   context('one schema-level deep', () => {
  //     context('with the default id', () => {
  //       const user = schema('user');
  //       const post = schema('post', { author: user });
  //       const reducer = add(user).from(post);
  //       const state = {
  //         user1: {
  //           id: 'user1',
  //           isUser1: true
  //         }
  //       };
  //       const payload = {
  //         id: 'post2',
  //         isPost2: true,
  //         author: {
  //           id: 'user2',
  //           isUser2: true
  //         }
  //       };
  //       const expected = {
  //         user1: {
  //           id: 'user1',
  //           isUser1: true
  //         },
  //         user2: {
  //           id: 'user2',
  //           isUser2: true
  //         }
  //       };
  //
  //       scenarios(
  //         'should key the sub-entity by id',
  //         'should key multiple entities by id',
  //         reducer, state, payload, expected
  //       );
  //
  //       it('should ignore entities that are missing a prop', () => {
  //         const user = schema('user');
  //         const post = schema('post', { author: user });
  //         const state = {
  //           user1: {
  //             id: 'user1',
  //             isUser1: true
  //           }
  //         };
  //         const payload = {
  //           id: 'post2',
  //           isPost2: true
  //         };
  //
  //         const reducer = add(user).from(post);
  //         reducer(state, payload).should.eql({
  //           user1: {
  //             id: 'user1',
  //             isUser1: true
  //           }
  //         });
  //       });
  //     });
  //
  //     context('with a string key', () => {
  //       const user = schema('user', 'user_id');
  //       const post = schema('post', { author: user });
  //       const reducer = add(user).from(post);
  //       const state = {
  //         user1: {
  //           user_id: 'user1',
  //           isUser1: true
  //         }
  //       };
  //       const payload = {
  //         id: 'post2',
  //         isPost2: true,
  //         author: {
  //           user_id: 'user2',
  //           isUser2: true
  //         }
  //       };
  //       const expected = {
  //         user1: {
  //           user_id: 'user1',
  //           isUser1: true
  //         },
  //         user2: {
  //           user_id: 'user2',
  //           isUser2: true
  //         }
  //       };
  //
  //       scenarios(
  //         'should key the sub-entity by id',
  //         'should key multiple entities by id',
  //         reducer, state, payload, expected
  //       );
  //
  //       it('should ignore entities that are missing a prop', () => {
  //         const user = schema('user');
  //         const post = schema('post', { author: user });
  //         const state = {
  //           user1: {
  //             user_id: 'user1',
  //             isUser1: true
  //           }
  //         };
  //         const payload = {
  //           id: 'post2',
  //           isPost2: true
  //         };
  //
  //         const reducer = add(user).from(post);
  //         reducer(state, payload).should.eql({
  //           user1: {
  //             user_id: 'user1',
  //             isUser1: true
  //           }
  //         });
  //       });
  //     });
  //
  //     context('with a function to generate a key', () => {
  //       const user = schema('user', (entity) => entity.user_id);
  //       const post = schema('post', { author: user });
  //       const reducer = add(user).from(post);
  //       const state = {
  //         user1: {
  //           user_id: 'user1',
  //           isUser1: true
  //         }
  //       };
  //       const payload = {
  //         id: 'post2',
  //         isPost2: true,
  //         author: {
  //           user_id: 'user2',
  //           isUser2: true
  //         }
  //       };
  //       const expected = {
  //         user1: {
  //           user_id: 'user1',
  //           isUser1: true
  //         },
  //         user2: {
  //           user_id: 'user2',
  //           isUser2: true
  //         }
  //       };
  //
  //       scenarios(
  //         'should key the sub-entity by id',
  //         'should key multiple entities by id',
  //         reducer, state, payload, expected
  //       );
  //
  //       it('should ignore entities that are missing a prop', () => {
  //         const user = schema('user');
  //         const post = schema('post', { author: user });
  //         const state = {
  //           user1: {
  //             user_id: 'user1',
  //             isUser1: true
  //           }
  //         };
  //         const payload = {
  //           id: 'post2',
  //           isPost2: true
  //         };
  //
  //         const reducer = add(user).from(post);
  //         reducer(state, payload).should.eql({
  //           user1: {
  //             user_id: 'user1',
  //             isUser1: true
  //           }
  //         });
  //       });
  //     });
  //   });
  //
  //   context('more than one schema-level deep', () => {
  //     context('with a single-level entity', () => {
  //       const user = schema('user');
  //       const comment = schema('comment', { author: user });
  //       const post = schema('post', { comments: [comment] });
  //       const reducer = add(user).from(post);
  //       const state = {
  //         user1: {
  //           id: 'user1',
  //           isUser1: true
  //         }
  //       };
  //       const payload = {
  //         id: 'post2',
  //         isPost2: true,
  //         comments: [{
  //           author: {
  //             id: 'user2',
  //             isUser2: true
  //           }
  //         }]
  //       };
  //       const expected = {
  //         user1: {
  //           id: 'user1',
  //           isUser1: true
  //         },
  //         user2: {
  //           id: 'user2',
  //           isUser2: true
  //         }
  //       };
  //
  //       scenarios(
  //         'should key the sub-entity by id',
  //         'should key multiple entities by id',
  //         reducer, state, payload, expected
  //       );
  //     });
  //
  //     context('with a list of entities', () => {
  //       const user = schema('user');
  //       const comment = schema('comment', { author: [user] });
  //       const post = schema('post', { comments: [comment] });
  //       const reducer = add(user).from(post);
  //       const state = {
  //         user1: {
  //           id: 'user1',
  //           isUser1: true
  //         }
  //       };
  //       const payload = {
  //         id: 'post2',
  //         isPost2: true,
  //         comments: [{
  //           author: [{
  //             id: 'user2',
  //             isUser2: true
  //           }]
  //         }]
  //       };
  //       const expected = {
  //         user1: {
  //           id: 'user1',
  //           isUser1: true
  //         },
  //         user2: {
  //           id: 'user2',
  //           isUser2: true
  //         }
  //       };
  //
  //       scenarios(
  //         'should key the sub-entity by id',
  //         'should key multiple entities by id',
  //         reducer, state, payload, expected
  //       );
  //     });
  //
  //     context('the exact thing cause wtf', () => {
  //       const requirement = schema('requirement');
  //       const owner = schema('owner');
  //       const work = schema('work', {
  //         owner: [owner]
  //       });
  //       const task = schema('task', {
  //         work: {
  //           fe: work,
  //           api: work,
  //           devOps: work,
  //           qe: work,
  //           other: work
  //         },
  //         requirements: [requirement]
  //       });
  //       const board = schema('board', {
  //         tasks: [task]
  //       });
  //       const reducer = add(requirement).from(board);
  //       const state = {};
  //       const payload = {
  //         tasks: [{
  //           requirements: [{
  //             id: 'req1',
  //             isReq1: true
  //           }]
  //         }]
  //       };
  //       const expected = {
  //         req1: {
  //           id: 'req1',
  //           isReq1: true
  //         }
  //       };
  //
  //       scenarios(
  //         'should do the right thing',
  //         'should do the right thing more',
  //         reducer, state, payload, expected
  //       );
  //     });
  //   });
  //
  //   context('with a list of entities', () => {
  //     const user = schema('user');
  //     const post = schema('post', { authors: [user] });
  //     const reducer = add(user).from(post);
  //     const state = {
  //       user1: {
  //         id: 'user1',
  //         isUser1: true
  //       }
  //     };
  //     const payload = {
  //       id: 'post2',
  //       isPost2: true,
  //       authors: [{
  //         id: 'user2',
  //         isUser2: true
  //       }]
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
  //       'should key the sub-entity by id',
  //       'should key multiple entities by id',
  //       reducer, state, payload, expected
  //     );
  //   });
  // });
};
