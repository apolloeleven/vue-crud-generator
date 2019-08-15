const fs = require('fs');
const path = require('path');
const GeneralHelper = require('./helpers/general-helper');

class Generator {

  constructor(params) {
    this.path = params.path;
    this.name = params.name;
    this.field_names = params.field_names;
  }

  init() {

    this.checkDirValidity();

    this.createMainComponent();

  }

  checkDirValidity() {
    if (!fs.existsSync(this.path)) {
      fs.mkdirSync(this.path);
    } else {
      throw new Error('Folder already exists in the provided path.')
    }
  }

  createMainComponent() {

    let mainDivClass = this.name.toLowerCase();
    let componentName = GeneralHelper.capitalize(mainDivClass);

    const templateFile = path.join(__dirname, 'templates/main.component.vue');
    const newFile = path.join(this.path, `${componentName}.vue`);

    try {
      fs.copyFileSync(templateFile, newFile);
    } catch (err) {
      throw new Error(`Error occurred while copying main component template file. Message: ${err.message}`);
    }

    fs.readFile(newFile, 'utf8', function (err, data) {
      if (err) throw new Error(`Error while reading newly created file. Message: ${err.message}`);

      let result = data
        .replace('{{mainDivClass}}', mainDivClass)
        .replace('{{componentName}}', componentName);

      fs.writeFile(newFile, result, 'utf8', function (err) {
        if (err) throw new Error(`Error while saving newly updated file. Message: ${err.message}`)
      });
    });

  }

}

module.exports = Generator;
