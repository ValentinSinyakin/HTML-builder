
const path = require('path');
const fs = require('fs/promises');

const folder = path.join(__dirname, 'files');
const newFolder = path.join(__dirname, 'files-copy');

const copyToNewFolder = async (oldFold, newFold, err) => {
  if (err) throw err;
  await fs.rm(newFold, { force: true, recursive: true });
  await fs.mkdir(newFold);
  const files = await fs.readdir(oldFold, { withFileTypes: true });  
  files.forEach(file => {
    const oldPath = path.join(oldFold, file.name);
    const newPath = path.join(newFold, file.name);
    
    if (file.isFile()) {
      fs.copyFile(oldPath, newPath);        
    } else {
      copyToNewFolder(oldPath, newPath);
    }
  });
  console.log('files copied');
};
copyToNewFolder(folder, newFolder);