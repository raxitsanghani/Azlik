const fs = require('fs');
const path = require('path');

function replaceAny(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceAny(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;
      content = content.replace(/: any\b/g, ': unknown');
      content = content.replace(/<any>/g, '<unknown>');
      content = content.replace(/: any\[\]/g, ': unknown[]');
      if (content !== original) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

replaceAny(path.join(__dirname, 'src'));
