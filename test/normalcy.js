import 'should';
import { schema, add } from '../src/normalcy';

describe('normalcy', () => {
  describe('add', () => {
    context('with no parent schema', () => {
      context('and no shape', () => {
        context('and a single entity', () => {
          it('should key the entity by id', () => {
            const user = schema('user');
            const state = {
              user1: {
                id: 'user1',
                isUser1: true
              }
            };
            const payload = {
              id: 'user2',
              isUser2: true
            };

            const reducer = add(user);
            reducer(state, payload).should.eql({
              user1: {
                id: 'user1',
                isUser1: true
              },
              user2: {
                id: 'user2',
                isUser2: true
              }
            });
          });
        });

        context('and a list of entities', () => {
          it('should key each entity by id', () => {
            const user = schema('user');
            const state = {
              user1: {
                id: 'user1',
                isUser1: true
              }
            };
            const payload = [{
              id: 'user2',
              isUser2: true
            }, {
              id: 'user3',
              isUser3: true
            }];

            const reducer = add(user);
            reducer(state, payload).should.eql({
              user1: {
                id: 'user1',
                isUser1: true
              },
              user2: {
                id: 'user2',
                isUser2: true
              },
              user3: {
                id: 'user3',
                isUser3: true
              }
            });
          });
        });
      });

      context('and a simple object shape', () => {
        context('and a single entity', () => {
          it('should key the entity by id and replace sub-entities with ids', () => {
            const user = schema('user');
            const post = schema('post', { author: user });
            const state = {
              post1: {
                id: 'post1',
                isPost1: true,
                author: 'user1'
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

            const reducer = add(post);
            reducer(state, payload).should.eql({
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
            });
          });
        });

        context('and a list of entities', () => {
          it('should key each entity by id and replace sub-entities with ids', () => {
            const user = schema('user');
            const post = schema('post', { author: user });
            const state = {
              post1: {
                id: 'post1',
                isPost1: true,
                author: 'user1'
              }
            };
            const payload = [{
              id: 'post2',
              isPost2: true,
              author: {
                id: 'user2',
                isUser2: true
              }
            }, {
              id: 'post3',
              isPost3: true,
              author: {
                id: 'user3',
                isUser3: true
              }
            }];

            const reducer = add(post);
            reducer(state, payload).should.eql({
              post1: {
                id: 'post1',
                isPost1: true,
                author: 'user1'
              },
              post2: {
                id: 'post2',
                isPost2: true,
                author: 'user2'
              },
              post3: {
                id: 'post3',
                isPost3: true,
                author: 'user3'
              }
            });
          });
        });
      });

      context('and a simple but nested object shape', () => {
        context('and a single entity', () => {
          it('should key the entity by id and replace sub-entities with ids', () => {
            const user = schema('user');
            const post = schema('post', { meta: { author: user }});
            const state = {
              post1: {
                id: 'post1',
                isPost1: true,
                meta: {
                  author: 'user1',
                  created: 'yesterday'
                }
              }
            };
            const payload = {
              id: 'post2',
              isPost2: true,
              meta: {
                author: {
                  id: 'user2',
                  isUser2: true
                },
                created: 'today'
              }
            };

            const reducer = add(post);
            reducer(state, payload).should.eql({
              post1: {
                id: 'post1',
                isPost1: true,
                meta: {
                  author: 'user1',
                  created: 'yesterday'
                }
              },
              post2: {
                id: 'post2',
                isPost2: true,
                meta: {
                  author: 'user2',
                  created: 'today'
                }
              }
            });
          });
        });

        context('and a list of entities', () => {
          it('should key the entity by id and replace sub-entities with ids', () => {
            const user = schema('user');
            const post = schema('post', { meta: { author: user }});
            const state = {
              post1: {
                id: 'post1',
                isPost1: true,
                meta: {
                  author: 'user1',
                  created: 'yesterday'
                }
              }
            };
            const payload = [{
              id: 'post2',
              isPost2: true,
              meta: {
                author: {
                  id: 'user2',
                  isUser2: true
                },
                created: 'today'
              }
            }, {
              id: 'post3',
              isPost3: true,
              meta: {
                author: {
                  id: 'user3',
                  isUser2: true
                },
                created: 'tomorrow'
              }
            }];

            const reducer = add(post);
            reducer(state, payload).should.eql({
              post1: {
                id: 'post1',
                isPost1: true,
                meta: {
                  author: 'user1',
                  created: 'yesterday'
                }
              },
              post2: {
                id: 'post2',
                isPost2: true,
                meta: {
                  author: 'user2',
                  created: 'today'
                }
              },
              post3: {
                id: 'post3',
                isPost3: true,
                meta: {
                  author: 'user3',
                  created: 'tomorrow'
                }
              }
            });
          });
        });
      });

      context('and an array of sub-schemas', () => {
        context('and a single entity', () => {
          it('should key the entity by id and replace sub-entities with ids', () => {
            const user = schema('user');
            const post = schema('post', { authors: [user] });
            const state = {
              post1: {
                id: 'post1',
                isPost1: true,
                authors: ['user1']
              }
            };
            const payload = {
              id: 'post2',
              isPost2: true,
              authors: [{
                id: 'user2',
                isUser2: true
              }, {
                id: 'user3',
                isUser3: true
              }]
            };

            const reducer = add(post);
            reducer(state, payload).should.eql({
              post1: {
                id: 'post1',
                isPost1: true,
                authors: ['user1']
              },
              post2: {
                id: 'post2',
                isPost2: true,
                authors: ['user2', 'user3']
              }
            });
          });
        });

        context('and a list of entities', () => {
          it('should key the entity by id and replace sub-entities with ids', () => {
            const user = schema('user');
            const post = schema('post', { authors: [user] });
            const state = {
              post1: {
                id: 'post1',
                isPost1: true,
                authors: ['user1']
              }
            };
            const payload = [{
              id: 'post2',
              isPost2: true,
              authors: [{
                id: 'user2',
                isUser2: true
              }, {
                id: 'user3',
                isUser3: true
              }]
            }, {
              id: 'post3',
              isPost3: true,
              authors: [{
                id: 'user4',
                isUser4: true
              }, {
                id: 'user5',
                isUser5: true
              }]
            }];

            const reducer = add(post);
            reducer(state, payload).should.eql({
              post1: {
                id: 'post1',
                isPost1: true,
                authors: ['user1']
              },
              post2: {
                id: 'post2',
                isPost2: true,
                authors: ['user2', 'user3']
              },
              post3: {
                id: 'post3',
                isPost3: true,
                authors: ['user4', 'user5']
              }
            });
          });
        });
      });

      context('and an array of objects with sub-schemas', () => {
        context('and a single entity', () => {
          it('should key the entity by id and replace sub-entities with ids', () => {
            const user = schema('user');
            const post = schema('post', { authors: [{ creator: user, editor: user }] });
            const state = {
              post1: {
                id: 'post1',
                isPost1: true,
                authors: [{
                  creator: 'user1',
                  editor: 'user2'
                }]
              }
            };
            const payload = {
              id: 'post2',
              isPost2: true,
              authors: [{
                creator: {
                  id: 'user3',
                  isUser3: true
                },
                editor: {
                  id: 'user4',
                  isUser4: true
                }
              }]
            };

            const reducer = add(post);
            reducer(state, payload).should.eql({
              post1: {
                id: 'post1',
                isPost1: true,
                authors: [{
                  creator: 'user1',
                  editor: 'user2'
                }]
              },
              post2: {
                id: 'post2',
                isPost2: true,
                authors: [{
                  creator: 'user3',
                  editor: 'user4'
                }]
              }
            });
          });
        });

        context('and a list of entities', () => {
          it('should key the entity by id and replace sub-entities with ids', () => {
            const user = schema('user');
            const post = schema('post', { authors: [{ creator: user, editor: user }] });
            const state = {
              post1: {
                id: 'post1',
                isPost1: true,
                authors: [{
                  creator: 'user1',
                  editor: 'user2'
                }]
              }
            };
            const payload = [{
              id: 'post2',
              isPost2: true,
              authors: [{
                creator: {
                  id: 'user3',
                  isUser3: true
                },
                editor: {
                  id: 'user4',
                  isUser4: true
                }
              }]
            }, {
              id: 'post3',
              isPost3: true,
              authors: [{
                creator: {
                  id: 'user5',
                  isUser5: true
                },
                editor: {
                  id: 'user6',
                  isUser6: true
                }
              }]
            }];

            const reducer = add(post);
            reducer(state, payload).should.eql({
              post1: {
                id: 'post1',
                isPost1: true,
                authors: [{
                  creator: 'user1',
                  editor: 'user2'
                }]
              },
              post2: {
                id: 'post2',
                isPost2: true,
                authors: [{
                  creator: 'user3',
                  editor: 'user4'
                }]
              },
              post3: {
                id: 'post3',
                isPost3: true,
                authors: [{
                  creator: 'user5',
                  editor: 'user6'
                }]
              }
            });
          });
        });
      });

      context('and an array of objects with sub-schemas with arrays', () => {
        context('and a single entity', () => {
          it('should key the entity by id and replace sub-entities with ids', () => {
            const user = schema('user');
            const post = schema('post', { authors: [{ creator: [user], editor: [user] }] });
            const state = {
              post1: {
                id: 'post1',
                isPost1: true,
                authors: [{
                  creator: ['user1', 'user2'],
                  editor: ['user3', 'user4']
                }]
              }
            };
            const payload = {
              id: 'post2',
              isPost2: true,
              authors: [{
                creator: [{
                  id: 'user5',
                  isUser5: true
                }, {
                  id: 'user6',
                  isUser6: true
                }],
                editor: [{
                  id: 'user7',
                  isUser7: true
                }, {
                  id: 'user8',
                  isUser8: true
                }]
              }]
            };

            const reducer = add(post);
            reducer(state, payload).should.eql({
              post1: {
                id: 'post1',
                isPost1: true,
                authors: [{
                  creator: ['user1', 'user2'],
                  editor: ['user3', 'user4']
                }]
              },
              post2: {
                id: 'post2',
                isPost2: true,
                authors: [{
                  creator: ['user5', 'user6'],
                  editor: ['user7', 'user8']
                }]
              },
            });
          });
        });
      });
    });
  });
});
