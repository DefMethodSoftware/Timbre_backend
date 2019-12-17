'use strict';

module.exports = {
  diff: true,
  extension: ['js'],
  opts: false,
  package: './package.json',
  reporter: 'spec',
  slow: 75,
  timeout: 2000,
  ui: 'bdd',
  'watch-files': ['lib/**/*.js', 'test/**/*.js'],
  'watch-ignore': ['app.js']
};