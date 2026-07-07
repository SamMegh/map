const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const correctAttachedLine = `
              const attachedLine = lines.find(l => {
                if (l.attachedTokenId !== st.id) return false;
                if (l.tool !== 'pen' && l.tool !== 'polygon' && l.tool !== 'arrow') return false;
                const lineStart = { x: l.points[0], y: l.points[1] };
                const dist = Math.hypot(lineStart.x - st.x, lineStart.y - st.y);
                return dist < 100;
              });`;

code = code.replace(
  /const attachedLine = lines\.find\(l => \{\s*if \(l\.type !== 'path'\) return false;\s*const points = l\.points;\s*if \(points\.length < 2\) return false;\s*const p0 = points\[0\];\s*const dist = Math\.sqrt\(Math\.pow\(p0\.x - st\.x, 2\) \+ Math\.pow\(p0\.y - st\.y, 2\)\);\s*return dist < 30;\s*\}\);/g,
  correctAttachedLine
);

fs.writeFileSync('src/App.tsx', code);
