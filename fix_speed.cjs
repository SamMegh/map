const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// Add animationSpeed state
code = code.replace(
  /const \[isLocked, setIsLocked\] = useState\(false\);/,
  "const [isLocked, setIsLocked] = useState(false);\n  const [animationSpeed, setAnimationSpeed] = useState<number>(1);"
);

// Update DURATION in useEffect
code = code.replace(
  /const DURATION = 1000;/,
  "const DURATION = 1000 / animationSpeed;"
);
code = code.replace(
  /}, \[isPlaying, currentFrameIndex, frames, isLooping, lines\]\);/,
  "}, [isPlaying, currentFrameIndex, frames, isLooping, lines, animationSpeed]);"
);

// Update exportGif
code = code.replace(
  /const fps = 10;\s*const delay = 1000 \/ fps;/,
  "const fps = 10;\n      const delay = 1000 / fps;\n      const framesToGenerate = Math.round(fps / animationSpeed);"
);
// In exportGif loop
code = code.replace(
  /for \(let frame = 0; frame < fps; frame\+\+\) \{\s*let progress = frame \/ fps;/g,
  "for (let frame = 0; frame < framesToGenerate; frame++) {\n            let progress = frame / framesToGenerate;"
);

// Update exportVideo
code = code.replace(
  /const fps = 30;\s*let frameCount = 0;/,
  "const fps = 30;\n      const framesToGenerate = Math.round(fps / animationSpeed);\n      let frameCount = 0;"
);

// In exportVideo single frame loop
code = code.replace(
  /for \(let i = 0; i < fps; i\+\+\) \{/g,
  "for (let i = 0; i < framesToGenerate; i++) {"
);

// Pass props to TopBar
code = code.replace(
  /autoSaveFrequency=\{autoSaveFrequency\}\n\s*setAutoSaveFrequency=\{setAutoSaveFrequency\}\n\s*\/>\}/,
  "autoSaveFrequency={autoSaveFrequency}\n        setAutoSaveFrequency={setAutoSaveFrequency}\n        animationSpeed={animationSpeed}\n        setAnimationSpeed={setAnimationSpeed}\n      />}"
);

fs.writeFileSync('src/App.tsx', code);
