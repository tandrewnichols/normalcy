export function scenarios(singleMsg, multipleMsg, reducer, state, payload, expected) {
  it(singleMsg, () => reducer(state, payload).should.eql(expected));
  it(multipleMsg, () => reducer(state, [payload]).should.eql(expected));
};
