'use strict';

const diff = require('deep-diff').diff;
const install = require('install-package');
const uninstall = require('uninstall-package');

module.exports = function(a, b) {
  return install([a, b]).then(() => {
    let A = require(a);
    let B = require(b);
    let result = diff(A, B);
    return uninstall([a, b]).then(() => result);
  });
};
