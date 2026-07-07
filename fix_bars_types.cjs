const fs = require('fs');
let code = fs.readFileSync('src/components/Bars.tsx', 'utf-8');

code = code.replace(
  /onDeleteFrame\?: \(\) => void;\n  autoSaveFrequency\?: 'frequent' \| 'significant' \| 'off';\n  setAutoSaveFrequency\?: \(freq: 'frequent' \| 'significant' \| 'off'\) => void;\n\}\) \{/,
  "onDeleteFrame?: () => void;\n  animationSpeed?: number;\n  setAnimationSpeed?: (speed: number) => void;\n  autoSaveFrequency?: 'frequent' | 'significant' | 'off';\n  setAutoSaveFrequency?: (freq: 'frequent' | 'significant' | 'off') => void;\n}) {"
);

fs.writeFileSync('src/components/Bars.tsx', code);
