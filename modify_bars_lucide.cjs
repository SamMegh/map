const fs = require('fs');
let code = fs.readFileSync('src/components/Bars.tsx', 'utf-8');

code = code.replace(
  /import \{\n  Book,/,
  'import {\n  ImagePlay,\n  Book,'
);

fs.writeFileSync('src/components/Bars.tsx', code);
console.log("Updated Bars.tsx imports");
