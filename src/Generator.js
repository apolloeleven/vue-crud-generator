const fs = require('fs');
const path = require('path');
const pluralize = require('pluralize');

const GeneralHelper = require('./helpers/general-helper');

class Generator {

  constructor(params) {
    this.path = params.path;
    this.name = params.name;
    this.field_names = params.field_names;
    this.api_url = params.api_url;
  }

  init() {

    this.checkDirValidity();
    this.prepareVariables();

    this.createMainComponent();

    this.createService();

  }

  checkDirValidity() {
    if (!fs.existsSync(this.path)) {
      fs.mkdirSync(this.path);
    } else {
      throw new Error('Folder already exists in the provided path.')
    }
  }

  prepareVariables() {
    this.mainDivClass = GeneralHelper.unCapitalize(this.name);
    this.mainUrl = this.mainDivClass.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`)
    this.componentName = GeneralHelper.capitalize(this.mainDivClass);
    this.serviceName = `${this.componentName}Service`;
  }

  createMainComponent() {

    const templateFile = path.join(__dirname, 'templates/main.component.template');
    const newFile = path.join(this.path, `${this.componentName}.vue`);

    this.createFileFromTemplate(templateFile, newFile);

    fs.readFile(newFile, 'utf8', (err, data) => {
      if (err) throw new Error(`Error while reading newly created component file. Message: ${err.message}`);

      let result = data
        .replace('{{mainDivClass}}', this.mainDivClass)
        .replace(/{{componentName}}/g, this.componentName)
        .replace(/{{componentNamePlural}}/g, pluralize.plural(this.componentName))
        .replace(/{{listVariableName}}/g, pluralize.plural(this.mainDivClass))
        .replace('{{tableFields}}', this.getTableFieldsFileData())
        .replace(/{{mainUrl}}/g, this.mainUrl)
        .replace(/{{serviceName}}/g, this.serviceName);

      fs.writeFile(newFile, result, 'utf8', function (err) {
        if (err) throw new Error(`Error while saving newly updated file. Message: ${err.message}`)
      });
    });

  }

  createService() {
    const templateFile = path.join(__dirname, 'templates/service.template');
    const newFile = path.join(this.path, `${this.componentName}Service.js`);

    this.createFileFromTemplate(templateFile, newFile);

    fs.readFile(newFile, 'utf8', (err, data) => {
      if (err) throw new Error(`Error while reading newly created service file. Message: ${err.message}`);

      let result = data
        .replace(/{{componentName}}/g, this.componentName)
        .replace(/{{apiUrl}}/g, this.api_url)
        .replace(/{{componentNamePlural}}/g, pluralize.plural(this.componentName));

      fs.writeFile(newFile, result, 'utf8', function (err) {
        if (err) throw new Error(`Error while saving newly updated service file. Message: ${err.message}`)
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

  createFileFromTemplate(templateFile, newFile) {
    try {
      fs.copyFileSync(templateFile, newFile);
    } catch (err) {
      throw new Error(`Error occurred while copying template file. Message: ${err.message}`);
    }
  }

}

module.exports = Generator;
