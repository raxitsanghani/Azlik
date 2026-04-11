const fs = require('fs');
const path = require('path');

const replacements = [
  { regex: /\btext-gray-400\b/g, replace: 'text-gray-500' },
  { regex: /\btext-gray-300\b/g, replace: 'text-gray-500' },
  { regex: /\btext-premium-charcoal\/40\b/g, replace: 'text-premium-charcoal/70' },
  { regex: /\btext-premium-charcoal\/30\b/g, replace: 'text-premium-charcoal/60' },
  { regex: /\btext-premium-charcoal\/50\b/g, replace: 'text-premium-charcoal/80' },
  { regex: /\btext-white\/40\b/g, replace: 'text-white/70' },
  { regex: /\bopacity-30\b/g, replace: 'opacity-70' },
  { regex: /\bopacity-40\b/g, replace: 'opacity-70' },
  { regex: /\bopacity-50\b/g, replace: 'opacity-80' },
  { regex: /\btext-premium-charcoal\/10\b/g, replace: 'text-premium-charcoal/40' },
  { regex: /\btext-\[8px\]\b/g, replace: 'text-[10px]' }, // Improve tiny text size
  { regex: /\btext-\[9px\]\b/g, replace: 'text-[11px]' } // Improve tiny text size
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let newContent = content;
      for (const rule of replacements) {
        newContent = newContent.replace(rule.regex, rule.replace);
      }
      if (newContent !== content) {
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log('Fixed', fullPath);
      }
    }
  }
}

processDirectory('./src');
console.log('Visibility fix complete.');
