module.exports = {
  'name': {
    demand: true,
    alias: 'n',
    describe: 'The general CRUD name',
    string: true
  },
  'path': {
    demand: true,
    alias: 'p',
    describe: 'The path where the crud folder and its data will be generated',
    string: true
  },
  'field-names': {
    demand: true,
    alias: 'fn',
    describe: 'Comma separated field names',
  }
};