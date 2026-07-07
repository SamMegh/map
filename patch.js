const fs = require('fs');
let code = fs.readFileSync('src/components/Bars.tsx', 'utf-8');
code = code.replace('<Tooltip content="Settings" side="bottom"><button onClick={onShowShortcuts} className="p-1.5 hover:bg-white/10 rounded transition-colors" >', '<Tooltip content="Settings" side="bottom"><button onClick={onShowSettings} className="p-1.5 hover:bg-white/10 rounded transition-colors" >');
fs.writeFileSync('src/components/Bars.tsx', code);
