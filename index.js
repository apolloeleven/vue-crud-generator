const yargs = require('yargs');
const Generator = require('./src/Generator');

const yargsConfig = require('./config/yargs-config');

const argv = yargs
  .options(yargsConfig)
  .help('h')
  .alias('help', 'h')
  .argv;

let generator = new Generator({
  name: argv.name,
  path: argv.path,
  field_names: argv['field-names'].split(',')
});

generator.init();
