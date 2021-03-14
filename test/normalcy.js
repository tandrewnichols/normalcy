import 'should';

const tests = {
  add: require.context('./add', false, /\.js$/),
  remove: require.context('./remove', false, /\.js$/)
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
});
