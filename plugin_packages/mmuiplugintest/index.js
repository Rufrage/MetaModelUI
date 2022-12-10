class TestClass {
  testAttribute;

  constructor() {
    console.log("Init successfull");
  }
}

function createInstance() {
  return new TestClass();
}

module.exports = {createInstance: createInstance};
