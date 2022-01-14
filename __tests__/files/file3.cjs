// this is the value of module.default returned from import(__filename)
module.exports = function () {
  return 'file3.cjs';
};

module.exports.other = function other() {
  return 'other for file1.js';
};