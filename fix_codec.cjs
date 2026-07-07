const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');
code = code.replace(/codec: 'avc1\.42001f',/, "codec: 'avc1.420028',");
fs.writeFileSync('src/App.tsx', code);
