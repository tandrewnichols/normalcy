import 'should';

const tests = {
  add: require.context('./add', false, /\.js$/),
  remove: require.context('./remove', false, /\.js$/),
  merge: require.context('./merge', false, /\.js$/),
  compose: require.context('./compose', false, /\.js$/)
};

const runTests = (type) => tests[type].keys().forEach((test) => {
  tests[type](test).default();
});

describe('normalcy', () => {
  describe('add', () => {
    runTests('add');
  });

  describe('remove', () => {
    runTests('remove');
  });

  describe('merge', () => {
    runTests('merge');
  });

  describe('compose', () => {
    runTests('compose');
  });
});
