const fs = require('fs/promises');
const path = require('path');
const svgtojsx = require('svg-to-jsx');

async function translateFileSVGtoJSX(basename) {
  const scuffedJSX = await fs.readFile(`static/${basename}.svg`, 'utf8').then(svgtojsx);
  const match = scuffedJSX.match(/(@font-face.+)/);
  const str = match[0].slice(0, -8);
  const iStart = match.index;
  const iEnd = iStart + str.length;
  const jsx = scuffedJSX.slice(0, iStart) + '{"' + str + '"}' + scuffedJSX.slice(iEnd);
  await fs.writeFile(`static/${basename}.jsx`, `import React from 'react';\nexport default ${jsx}`);
}

void async function main() {
  const files = await fs.readdir('static');
  const writtenFiles = await Promise.all(files.flatMap((file) => {
    if(file.endsWith('.svg')) {
      const basename = path.basename(file, path.extname(file));
      return [translateFileSVGtoJSX(basename).then(() => basename)];
    } else {
      return [];
    }
  }));
  const svgs = writtenFiles.map((basename) => {
    const exportName = basename.replace(/-./g, x=>x[1].toUpperCase());
    return `export { default as ${exportName} } from './static/${basename}';\n`;
  }).join('');
  await fs.writeFile('svgs.js', svgs);
}();
