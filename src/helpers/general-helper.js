const fs = require('fs');
const path = require('path');

capitalize = (s) => {
  if (typeof s !== 'string') {
    return ''
  } else {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
};

unCapitalize = (s) => {
  if (typeof s !== 'string') {
    return ''
  } else {
    return s.charAt(0).toLowerCase() + s.slice(1);
  }
};

eachWordCapitalize = (s) => {
  s = s.split(" ");
  for (var i = 0, x = s.length; i < x; i++) {
    s[i] = s[i][0].toUpperCase() + s[i].substr(1);
  }
  return s.join(" ");
};

emptyDir = (dir) => {
  fs.readdir(dir, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(path.join(dir, file), err => {
        if (err) throw err;
      });
    }
  });
};

module.exports = {
  capitalize,
  unCapitalize,
  eachWordCapitalize,
  emptyDir
};
