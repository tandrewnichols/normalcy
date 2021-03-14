import { schema, add } from 'src/normalcy';
import { scenarios } from 'test/helpers';

export default () => {
  context('add(schema).to(otherSchema).by(prop)', () => {
    context('with a key/value pair', () => {
      context('and a string key', () => {
        const user = schema('user');
        const post = schema('post', { author: user });
        const reducer = add(user).to(post).by('post_id');
        const state = {
          post1: {
            id: 'post1',
            isPost1: true,
            author: 'user1'
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
            author: 'user2'
          }
        };

        scenarios(
          'should add the key/value to the entity',
          'should add multiple key/values to the entity',
          reducer, state, payload, expected
        );
      });

      context('and a function that generates a key', () => {
        const user = schema('user');
        const post = schema('post', { author: user });
        const reducer = add(user).to(post).by((entity) => entity.post_id);
        const state = {
          post1: {
            id: 'post1',
            isPost1: true,
            author: 'user1'
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
            author: 'user2'
          }
        };

        scenarios(
          'should add the generated key to the entity',
          'should add multiple generated keys to the entity',
          reducer, state, payload, expected
        );
      });
    });

    context('with a list', () => {
      context('and the property doesn\'t exist yet', () => {
        const user = schema('user');
        const post = schema('post', { authors: [user] });
        const reducer = add(user).to(post).by('post_id');
        const state = {
          post1: {
            id: 'post1',
            isPost1: true
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
            authors: ['user2']
          }
        };

        scenarios(
          'should add the item to the list',
          'should add multiple items to the list',
          reducer, state, payload, expected
        );
      });

      context('and the property exists already', () => {
        const user = schema('user');
        const post = schema('post', { authors: [user] });
        const reducer = add(user).to(post).by('post_id');
        const state = {
          post1: {
            id: 'post1',
            isPost1: true,
            authors: ['user1']
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
            authors: ['user1', 'user2']
          }
        };

        scenarios(
          'should add the item to the list',
          'should add multiple items to the list',
          reducer, state, payload, expected
        );
      });
    });

    context('with nested entities', () => {
      const user = schema('user');
      const post = schema('post', { meta: { author: [user] }});
      const reducer = add(user).to(post).by('post_id');
      const state = {
        post1: {
          id: 'post1',
          isPost1: true,
          meta: {
            author: ['user1']
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
          meta: {
            author: ['user1', 'user2']
          }
        }
      };

      scenarios(
        'should add the entityt to the list',
        'should add multiple entities to the list',
        reducer, state, payload, expected
      );
    });
  });
};
