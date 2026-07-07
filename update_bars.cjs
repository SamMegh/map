const fs = require('fs');
let code = fs.readFileSync('src/components/Bars.tsx', 'utf-8');

const thumbnailComponent = `
const FrameThumbnail = ({ frame, mapImage, isActive, onClick, index }: { frame: any[], mapImage?: string, isActive: boolean, onClick: () => void, index: number }) => {
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });

  return (
    <button
      onClick={onClick}
      className={\`relative w-16 h-10 flex-shrink-0 rounded overflow-hidden border-2 transition-all \${
        isActive ? 'border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'border-white/10 hover:border-white/30'
      }\`}
      title={\`Frame \${index + 1}\`}
    >
      <div className="absolute inset-0 bg-neutral-900" />
      {mapImage && (
        <img 
          src={mapImage} 
          className="absolute inset-0 w-full h-full object-cover opacity-40" 
          alt={\`Frame \${index + 1}\`} 
          onLoad={(e) => {
            const img = e.target;
            setDimensions({ width: img.naturalWidth || 1920, height: img.naturalHeight || 1080 });
          }}
        />
      )}
      
      {frame.map(token => (
         <div 
           key={token.id}
           className="absolute rounded-full shadow-sm"
           style={{
             left: \`\${(token.x / dimensions.width) * 100}%\`,
             top: \`\${(token.y / dimensions.height) * 100}%\`,
             width: '3px',
             height: '3px',
             backgroundColor: token.color || '#fff',
             transform: 'translate(-50%, -50%)'
           }}
         />
      ))}
      <div className="absolute bottom-0 right-0 bg-black/70 text-[9px] font-bold px-1 rounded-tl text-white">
        {index + 1}
      </div>
    </button>
  );
};
`;

code = code.replace('export function TopBar', thumbnailComponent + '\nexport function TopBar');

const oldFramesMapStart = code.indexOf('{frames.map((_, i) =>');
const oldFramesMapEnd = code.indexOf('))}', oldFramesMapStart) + 3;
const oldFramesMap = code.substring(oldFramesMapStart, oldFramesMapEnd);

const newFramesMap = `{frames.map((frame, i) => (
              <FrameThumbnail 
                key={i}
                frame={frame}
                mapImage={activeMap?.image}
                isActive={currentFrameIndex === i}
                onClick={() => setCurrentFrameIndex(i)}
                index={i}
              />
            ))}`;

code = code.replace(oldFramesMap, newFramesMap);

fs.writeFileSync('src/components/Bars.tsx', code);
console.log("Updated Bars.tsx");
