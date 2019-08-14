const fs = require('fs');

class Generator {

  constructor(params) {
    this.path = params.path;
    this.name = params.name;
  }

  init() {
    this.checkDirValidity();
  }

  checkDirValidity() {
    if (!fs.existsSync(this.path)) {
      fs.mkdirSync(this.path);
    } else {
      throw new Error('Folder already exists in the provided path.')
    }
  }

}

module.exports = Generator;
