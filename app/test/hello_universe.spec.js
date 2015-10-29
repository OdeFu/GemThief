// Default imports test
import greet from '../hello_world/hello_universe.js';

describe("hello universe", function () {

  it("greets better than hello world", function () {
    expect(greet()).toBe('Hello Universe!');
  });

});
