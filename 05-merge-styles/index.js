const fs = require('fs/promises');
const path = require('path');

const srcFolder = path.join(__dirname, 'styles');
const distFolder = path.join(__dirname, 'project-dist');

const mergeStyles = async (src, dist) => {
  const bundle = path.join(dist, 'bundle.css');
  await fs.rm(bundle, { force: true, recursive: true, });
  const files = await fs.readdir(src, { withFileTypes: true });
  for (const file of files) {
    if (file.isFile() && path.extname(file.name) === '.css') {
      const filePath = path.join(src, file.name);
      const data = await fs.readFile(filePath, 'utf8');      
      await fs.appendFile(bundle, `${data}\n`);
    }
  }
  console.log('marge finished');
};
mergeStyles(srcFolder, distFolder);