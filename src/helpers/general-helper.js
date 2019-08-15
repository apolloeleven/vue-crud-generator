const fs = require('fs');
const path = require('path');

module.exports = {
  capitalize: (s) => {
    if (typeof s !== 'string') {
      return ''
    } else {
      return s.charAt(0).toUpperCase() + s.slice(1);
    }
  },
  unCapitalize: (s) => {
    if (typeof s !== 'string') {
      return ''
    } else {
      return s.charAt(0).toLowerCase() + s.slice(1);
    }
  },
  emptyDir: (dir) => {
    fs.readdir(dir, (err, files) => {
      if (err) throw err;

      for (const file of files) {
        fs.unlink(path.join(dir, file), err => {
          if (err) throw err;
        });
      }
    });
  }
};
