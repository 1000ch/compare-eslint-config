'use strict';

const minimist = require('minimist');
const argv = minimist(process.argv.slice(2));
const Table = require('cli-table');
const compare = require('./');

if (argv._.length !== 2) {
  console.error('Specify 2 eslint-configs');
  process.exit(1);
}

let a = argv._[0];
let b = argv._[1];

function normalizeValue(value) {
  if (Array.isArray(value)) {
    let level = value.shift();
    let param = value.shift();

    if (typeof param === 'object') {
      param = Object.keys(param).map(key => `${key}: ${param[key]}`).join('\n');
    }

    if (param.length !== 0) {
      param = `\n${param}`;
    }

    return `${level} ${param}`;
  }
  return value || '';
}

compare(a, b).then(diffs => {
  let table = new Table({
    head : ['Rule', 'Left', 'Right']
  });

  for (let diff of diffs) {
    let key = diff.path[1];
    let left = normalizeValue(diff.lhs);
    let right = normalizeValue(diff.rhs);
    let data = {};
    data[key] = [left, right];
    table.push(data);
  }

  console.log(table.toString());
});
