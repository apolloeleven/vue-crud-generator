const fs = require('fs');
const path = require('path');
const pluralize = require('pluralize');

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

    let mainDivClass = GeneralHelper.unCapitalize(this.name);
    let mainUrl = mainDivClass.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`)
    let componentName = GeneralHelper.capitalize(mainDivClass);
    let serviceName = `${componentName}Service`;

    const templateFile = path.join(__dirname, 'templates/main.component');
    const newFile = path.join(this.path, `${componentName}.vue`);

    try {
      fs.copyFileSync(templateFile, newFile);
    } catch (err) {
      throw new Error(`Error occurred while copying main component template file. Message: ${err.message}`);
    }

    fs.readFile(newFile, 'utf8', (err, data) => {
      if (err) throw new Error(`Error while reading newly created file. Message: ${err.message}`);

      let result = data
        .replace('{{mainDivClass}}', mainDivClass)
        .replace(/{{componentName}}/g, pluralize.plural(componentName))
        .replace(/{{listVariableName}}/g, pluralize.plural(mainDivClass))
        .replace('{{tableFields}}', this.getTableFieldsFileData())
        .replace(/{{mainUrl}}/g, mainUrl)
        .replace(/{{serviceName}}/g, serviceName);

      fs.writeFile(newFile, result, 'utf8', function (err) {
        if (err) throw new Error(`Error while saving newly updated file. Message: ${err.message}`)
      });
    });

  }

  getTableFieldsFileData() {
    let returnData = "";
    for (var i = 0; i < this.field_names.length; i++) {
      returnData += `\t\t\t\t\t'${this.field_names[i]}',`;
      if (i !== this.field_names.length - 1) {
        returnData += '\n';
      }
    }
    return returnData;
  }

}

module.exports = Generator;
