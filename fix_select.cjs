const fs = require('fs');
let code = fs.readFileSync('src/components/Bars.tsx', 'utf-8');

const speedUI = `
          <button 
            onClick={() => setIsLooping && setIsLooping(!isLooping)} 
            className={\`p-1.5 rounded transition-colors \${isLooping ? 'bg-blue-600/30 text-blue-400' : 'hover:bg-white/10 text-neutral-400'}\`} 
            title="Continuous Loop"
          >
            <Repeat2 className="w-4 h-4" />
          </button>
          
          {animationSpeed && setAnimationSpeed && (
            <select 
              value={animationSpeed} 
              onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
              className="bg-transparent text-xs py-1 px-1.5 text-neutral-300 outline-none hover:bg-white/10 rounded cursor-pointer text-center"
              title="Animation Speed"
              style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
            >
              <option value="0.25" className="bg-neutral-800">0.25x</option>
              <option value="0.5" className="bg-neutral-800">0.5x</option>
              <option value="1" className="bg-neutral-800">1x</option>
              <option value="1.5" className="bg-neutral-800">1.5x</option>
              <option value="2" className="bg-neutral-800">2x</option>
            </select>
          )}
`;

code = code.replace(
  /<button\s+onClick=\{\(\) => setIsLooping && setIsLooping\(!isLooping\)\}\s+className=\{\`p-1\.5 rounded transition-colors \$\{isLooping \? 'bg-blue-600\/30 text-blue-400' : 'hover:bg-white\/10 text-neutral-400'\}\`\}\s+title="Continuous Loop"\s*>\s*<Repeat2 className="w-4 h-4" \/>\s*<\/button>/m,
  speedUI
);

fs.writeFileSync('src/components/Bars.tsx', code);
