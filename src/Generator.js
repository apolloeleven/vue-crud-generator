const fs = require('fs');
const path = require('path');
const pluralize = require('pluralize');

const GeneralHelper = require('./helpers/general-helper');

/**
 * @author Saiat Kalbiev <kalbievich11@gmail.com>
 */
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
    this.createFormComponent();
    this.createModule();
  }

  checkDirValidity() {
    if (!fs.existsSync(this.path)) {
      fs.mkdirSync(this.path);
    } else {
      throw new Error('Folder already exists in the provided path.')
    }
  }

  prepareVariables() {
    this.unCapitalizedComponentName = GeneralHelper.unCapitalize(this.name);
    this.mainUrl = this.unCapitalizedComponentName.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`)
    this.componentName = GeneralHelper.capitalize(this.unCapitalizedComponentName);
    this.componentNameVisual = this.name.replace(/([A-Z])/g, (g) => ` ${g[0].toUpperCase()}`);
    this.serviceName = `${this.componentName}Service`;
  }

  createMainComponent() {

    const templateFile = path.join(__dirname, 'templates/main.component.template');
    const newFile = path.join(this.path, `${this.componentName}.vue`);

    this.createFileFromTemplate(templateFile, newFile);

    fs.readFile(newFile, 'utf8', (err, data) => {
      if (err) throw new Error(`Error while reading newly created component file. Message: ${err.message}`);

      let result = data
        .replace('{{mainDivClass}}', this.mainUrl)
        .replace(/{{componentName}}/g, this.componentName)
        .replace(/{{componentNamePlural}}/g, pluralize.plural(this.componentName))
        .replace(/{{listVariableName}}/g, pluralize.plural(this.unCapitalizedComponentName))
        .replace('{{tableFields}}', this.getTableFieldsFileData())
        .replace(/{{mainUrl}}/g, this.mainUrl)
        .replace(/{{componentNameVisual}}/g, this.componentNameVisual)
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

  createFormComponent() {
    const templateFile = path.join(__dirname, 'templates/form.component.template');
    const newFile = path.join(this.path, `${this.componentName}Form.vue`);

    this.createFileFromTemplate(templateFile, newFile);

    fs.readFile(newFile, 'utf8', (err, data) => {
      if (err) throw new Error(`Error while reading newly created service file. Message: ${err.message}`);

      let result = data
        .replace(/{{mainDivClass}}/g, `${this.mainUrl}-form`)
        .replace(/{{componentNameVisual}}/g, this.componentNameVisual)
        .replace(/{{componentName}}/g, this.componentName)
        .replace(/{{objectVariableName}}/g, this.unCapitalizedComponentName)
        .replace(/{{mainUrl}}/g, this.mainUrl)
        .replace(/{{inputFields}}/g, this.getFormInputFieldsFileData())
        .replace(/{{serviceName}}/g, this.serviceName);

      fs.writeFile(newFile, result, 'utf8', function (err) {
        if (err) throw new Error(`Error while saving newly updated form component file. Message: ${err.message}`)
      });
    });
  }

  createModule() {
    const templateFile = path.join(__dirname, 'templates/module.template');
    const newFile = path.join(this.path, `${this.componentName}.module.js`);

    this.createFileFromTemplate(templateFile, newFile);

    fs.readFile(newFile, 'utf8', (err, data) => {
      if (err) throw new Error(`Error while reading newly created module file. Message: ${err.message}`);

      let result = data
        .replace(/{{componentName}}/g, this.componentName)
        .replace(/{{mainUrl}}/g, this.mainUrl)
        .replace(/{{componentNameVisualPlural}}/g, pluralize.plural(this.componentNameVisual));

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

  getFormInputFieldsFileData() {
    let returnData = "";

    for (var i = 0; i < this.field_names.length; i++) {
      const vModelData = `${this.unCapitalizedComponentName}.${this.field_names[i]}`;
      returnData += `
        <b-form-group label="${this.field_names[i]}" label-for="input-${this.field_names[i]}">
          <b-form-input id="input-${this.field_names[i]}" v-model="${vModelData}" placeholder="Enter ${this.field_names[i]} here"></b-form-input>
        </b-form-group>\n`;
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
