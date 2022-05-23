const fs = require('fs/promises');
const path = require('path');

const temPath = path.join(__dirname, 'template.html');
const copmPath = path.join(__dirname, 'components');
const projectPath = path.join(__dirname, 'project-dist');

const createFolder = async (bundleDir) => {
  await fs.rm(bundleDir, { force: true, recursive: true, });
  fs.mkdir(bundleDir);
  copyToNewFolder(path.join(__dirname, 'assets'),
    path.join(bundleDir, 'assets'));
  mergeStyles(bundleDir, path.join(__dirname, 'styles'));
  buildHtml(bundleDir,
    temPath,
    copmPath);
};

const copyToNewFolder = async (oldFold, newFold, err) => {
  if (err)  throw err;
  await fs.rm(newFold, { force: true, recursive: true, });
  await fs.mkdir(newFold);
  const files = await fs.readdir(oldFold, { withFileTypes: true });
  files.forEach(file => {
    let oldPath = path.join(oldFold, file.name);
    let newPath = path.join(newFold, file.name);
    if (file.isFile()) {
      fs.copyFile(oldPath, newPath);      
    } else {
      copyToNewFolder(oldPath, newPath);
    }
  });   
};

const mergeStyles = async (src, dist) => {
  const bundle = path.join(src, 'style.css');
  await fs.rm(bundle, { force: true, recursive: true, });
  const styleFiles = await fs.readdir(dist, { withFileTypes: true });
  for (const file of styleFiles) {
    if (file.isFile() && path.extname(file.name) === '.css') {
      const filePath = path.join(dist, file.name);
      const data = await fs.readFile(filePath, 'utf8');
      await fs.appendFile(bundle, `${data}\n`);
    }
  }
};

const buildHtml = async (src, template, mod) => {
  const newMod = {};
  const modules = await fs.readdir(mod);
  for (const module of modules) {
    const modName = module.substring(0, module.lastIndexOf('.'));
    const modPath = path.join(mod, module);
    newMod[modName] = await fs.readFile(modPath, 'utf8');
  }
  let stingFromTemp = await fs.readFile(template, 'utf8');
  for (const module in newMod) {
    if (stingFromTemp.match(`{{${module}}}`)) {
      const reg = new RegExp(`[{][{]${module}[}][}]`, 'gi');
      stingFromTemp = stingFromTemp.replace(reg, newMod[module]);
    }
  }
  const indexPath = path.join(src, 'index.html');
  fs.writeFile(indexPath, stingFromTemp);
};
createFolder(projectPath);