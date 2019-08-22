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
  field_names: argv['field-names'].split(','),
  translatable_field_names: argv['translatable-field-names'] ? argv['translatable-field-names'].split(',') : [],
  api_url: argv['api-url'],
  enable_pagination: argv['enable-pagination'],
});

generator.init();
