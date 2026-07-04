const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    try {
      filelist = walkSync(dirFile, filelist);
    } catch (err) {
      if (err.code === 'ENOTDIR' || err.code === 'EBADF') filelist.push(dirFile);
    }
  });
  return filelist;
};

const files = walkSync('./src').filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));

let changedFiles = [];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Replacements for spacing (padding, margin, gap)
  const spacingMap = {
    6: 'xs',
    10: 'sm',
    16: 'md',
    24: 'lg',
    32: 'xl',
    48: 'xxl'
  };

  const cssProps = ['padding', 'paddingHorizontal', 'paddingVertical', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight', 'margin', 'marginHorizontal', 'marginVertical', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight', 'gap', 'rowGap', 'columnGap'];

  cssProps.forEach(prop => {
    Object.keys(spacingMap).forEach(val => {
      const regex = new RegExp(`\\b${prop}:\\s*${val}\\b`, 'g');
      content = content.replace(regex, `${prop}: theme.spacing.${spacingMap[val]}`);
    });
  });

  // Card Border Radius and general Border Radius
  content = content.replace(/\bborderRadius:\s*32\b/g, 'borderRadius: theme.borderRadius.lg');
  content = content.replace(/\bborderRadius:\s*16\b/g, 'borderRadius: theme.borderRadius.sm');
  content = content.replace(/\bborderRadius:\s*24\b/g, 'borderRadius: theme.borderRadius.md');
  content = content.replace(/\bborderRadius:\s*40\b/g, 'borderRadius: theme.borderRadius.xl');
  content = content.replace(/\bborderRadius:\s*9999\b/g, 'borderRadius: theme.borderRadius.full');

  // Check if theme import is needed
  if (content !== original) {
    if (!content.includes("import { theme }")) {
      // Very naive import injection
      const depth = file.split('/').length - 2; // src/components/Card.tsx -> 1
      const relativePath = depth === 0 ? './theme' : '../'.repeat(depth) + 'theme';
      content = `import { theme } from '${relativePath}';\n` + content;
    }
    fs.writeFileSync(file, content);
    changedFiles.push(file);
  }
});

console.log("Modified files: ", changedFiles.length);
changedFiles.forEach(f => console.log(f));
