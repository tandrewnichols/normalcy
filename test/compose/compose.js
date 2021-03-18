import { schema, compose, add, remove } from 'src/normalcy';
import { scenarios } from 'test/helpers';

export default () => {
  context('compose(recucer1, reducer2)', () => {
    const user = schema('user');
    const post = schema('post', { authors: [user] });
    const reducer = compose(
      remove(user, 'previous_author').from(post, 'post_id'),
      add(user, 'new_author').to(post, 'post_id')
    );
    const state = {
      post1: {
        id: 'post1',
        isPost1: true,
        authors: ['user1', 'user2', 'user3']
      }
    };
    const payload = {
      post_id: 'post1',
      previous_author: 'user2',
      new_author: 'user4'
    };
    const expected = {
      post1: {
        id: 'post1',
        isPost1: true,
        authors: ['user1', 'user3', 'user4']
      }
    };

    scenarios(
      'should apply all the reducers to an entity',
      'should apply all the reducers to multiple entities',
      reducer, state, payload, expected
    );
  });
};
