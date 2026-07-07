const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');
code = code.replace(/firstTimestampBehavior: 'offset'/, "firstTimestampBehavior: 'offset',\n        fastStart: 'in-memory'");
fs.writeFileSync('src/App.tsx', code);
