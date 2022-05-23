const fs = require('fs');
const path = require('path');
const dp = path.join(__dirname, 'secret-folder');

fs.readdir(dp, { withFileTypes: true }, (err, data) => {
  if (err) {
    throw err;
  } else {
    data.forEach(item => {
      if (item.isFile()) {
        const itemPath = path.join(dp, item.name);
        fs.stat(itemPath, (err, stats) => {
          if (err) {
            throw err;
          } else {
            const itName = item.name.substring(0, item.name.lastIndexOf('.'));
            const itExt = path.extname(itemPath).split('.').join('');
            const itemSize = (stats.size / 1024).toFixed(3);
            console.log(`${itName} - ${itExt} - ${itemSize} kB`);
          }
        });
      }
    });
  }
});