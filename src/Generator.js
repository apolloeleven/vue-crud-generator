const fs = require('fs');
const path = require('path');
const pluralize = require('pluralize');
const Confirm = require('prompt-confirm');

const GeneralHelper = require('./helpers/general-helper');

/**
 * @author Saiat Kalbiev <kalbievich11@gmail.com>
 */
class Generator {

  constructor(params) {
    this.path = params.path;
    this.name = params.name;
    this.field_names = params.field_names;
    this.translatable_field_names = params.translatable_field_names;
    this.api_url = params.api_url;
  }

  init() {
    this.checkDirValidity().then(success => {
      this.prepareVariables();
      this.createMainComponent();
      this.createService();
      this.createFormComponent();
      this.createModule();
    }, error => {
    });
  }

  checkDirValidity() {
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(this.path)) {
        fs.mkdirSync(this.path);
        resolve();
      } else {
        (new Confirm("Folder already exists. Do you want to overwrite it ?")).run().then((answer) => {
          if (!answer) {
            reject()
          } else {
            GeneralHelper.emptyDir(this.path);
            resolve();
          }
        });
      }
    });
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
        .replace(/{{mainDivClass}}/g, this.mainUrl)
        .replace(/{{componentName}}/g, this.componentName)
        .replace(/{{componentNamePlural}}/g, pluralize.plural(this.componentName))
        .replace(/{{listVariableName}}/g, pluralize.plural(this.unCapitalizedComponentName))
        .replace('{{tableFields}}', this.getTableFieldsFileData() + this.getTableTranslatableFieldsFileData())
        .replace(/{{mainUrl}}/g, this.mainUrl)
        .replace(/{{componentNameVisual}}/g, this.componentNameVisual.trim())
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
        .replace(/{{translatableFields}}/g, this.getServiceTranslatableFieldsData())
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
        .replace(/{{componentNameVisual}}/g, this.componentNameVisual.trim())
        .replace(/{{componentName}}/g, this.componentName)
        .replace(/{{objectVariableName}}/g, this.unCapitalizedComponentName)
        .replace(/{{mainUrl}}/g, this.mainUrl)
        .replace(/{{inputFields}}/g, this.getFormInputFieldsFileData())
        .replace(/{{translatableInputFields}}/g, this.getFormTranslatableInputFieldsFileData())
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
        .replace(/{{componentNameVisualPlural}}/g, pluralize.plural(this.componentNameVisual).trim());

      fs.writeFile(newFile, result, 'utf8', function (err) {
        if (err) throw new Error(`Error while saving newly updated service file. Message: ${err.message}`)
      });
    });
  }

  getTableFieldsFileData() {
    let returnData = "";
    for (var i = 0; i < this.field_names.length; i++) {
      returnData += `
          {
            key: "${this.field_names[i]}",
            label: this.$i18n.t('${GeneralHelper.eachWordCapitalize(this.field_names[i].replace('_', ' '))}')
          },`;
    }
    return returnData;
  }

  getTableTranslatableFieldsFileData() {
    if (this.translatable_field_names.length === 0) {
      return '';
    }

    let returnData = "";
    for (var i = 0; i < this.translatable_field_names.length; i++) {
      returnData += `
          {
            key: "${this.translatable_field_names[i]}",
            label: this.$i18n.t('${GeneralHelper.eachWordCapitalize(this.translatable_field_names[i].replace('_', ' '))}')
          },`;
    }
    return returnData;
  }

  getFormInputFieldsFileData() {
    let returnData = "";

    for (let i = 0; i < this.field_names.length; i++) {
      const vModelData = `${this.unCapitalizedComponentName}.${this.field_names[i]}`;
      const labelText = GeneralHelper.eachWordCapitalize(this.field_names[i].replace('_', ' '));

      returnData += `
      <b-form-group b-form-group v-bind:label="$t('${labelText}')">
        <b-form-input v-model="${vModelData}"></b-form-input>
      </b-form-group>\n`;
    }

    return returnData;
  }

  getFormTranslatableInputFieldsFileData() {

    if (this.translatable_field_names.length === 0) {
      return '';
    }

    let returnData = `
      <div v-if="translatableFields.length > 0">
        <b-tabs content-class="mt-3">
          <b-tab v-for="locale in locales" v-bind:title="locale.name">
            <div class="form-group">
              {{innerData}}
            </div>
          </b-tab>
        </b-tabs>
      </div>`;

    let innerData = '';

    for (let i = 0; i < this.translatable_field_names.length; i++) {
      const labelText = GeneralHelper.eachWordCapitalize(this.translatable_field_names[i].replace('_', ' '));

      innerData += `
              <b-form-group v-bind:label="$t('${labelText}')">
                <b-form-input v-model="${this.unCapitalizedComponentName}['${this.field_names[i]}'][locale.key]">
                </b-form-input>
              </b-form-group>\n`;

    }

    return returnData.replace('{{innerData}}', innerData);
  }

  getServiceTranslatableFieldsData() {
    let returnData = "";
    for (var i = 0; i < this.field_names.length; i++) {
      returnData += `
        {
          name: '${this.field_names[i]}',
          type: 'text',
        },`;
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
