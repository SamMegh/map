const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const exportGifCode = `
  const exportGif = async () => {
    if (!stageRef.current) return;
    try {
      const { GIFEncoder, quantize, applyPalette } = await import('gifenc');
      
      const width = stageRef.current.width();
      const height = stageRef.current.height();
      
      const exportScale = 0.5; // downscale to 50% for performance and file size
      const exportWidth = Math.round(width * exportScale);
      const exportHeight = Math.round(height * exportScale);
      
      const offscreenCanvas = document.createElement('canvas');
      offscreenCanvas.width = exportWidth;
      offscreenCanvas.height = exportHeight;
      const offscreenCtx = offscreenCanvas.getContext('2d');
      if (!offscreenCtx) return;
      
      const gif = GIFEncoder();
      
      const fps = 10;
      const delay = 1000 / fps;
      
      setIsPlaying(false);
      setIsLooping(false);
      
      const originalIndex = currentFrameIndex;
      
      if (frames.length <= 1) {
          const uri = stageRef.current.toDataURL({ pixelRatio: exportScale });
          const img = new Image();
          img.src = uri;
          await new Promise(resolve => img.onload = resolve);
          offscreenCtx.drawImage(img, 0, 0);
          const imageData = offscreenCtx.getImageData(0, 0, exportWidth, exportHeight);
          const palette = quantize(imageData.data, 256, { format: 'rgba4444' });
          const index = applyPalette(imageData.data, palette, 'rgba4444');
          gif.writeFrame(index, exportWidth, exportHeight, { palette, delay: 1000 });
      } else {
        for (let i = 0; i < frames.length - 1; i++) {
          const startTokens = frames[i];
          const endTokens = frames[i+1];
          
          for (let frame = 0; frame < fps; frame++) {
            let progress = frame / fps;
            const easeProgress = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
            
            const interpolated = startTokens.map(st => {
              const et = endTokens.find(t => t.id === st.id) || st;
              const sRot = st.rotation || 0;
              const eRot = et.rotation || 0;
              let rotDiff = eRot - sRot;
              while (rotDiff > 180) rotDiff -= 360;
              while (rotDiff < -180) rotDiff += 360;
              
              const attachedLine = lines.find(l => {
                if (l.type !== 'path') return false;
                const points = l.points;
                if (points.length < 2) return false;
                const p0 = points[0];
                const dist = Math.sqrt(Math.pow(p0.x - st.x, 2) + Math.pow(p0.y - st.y, 2));
                return dist < 30;
              });
              
              if (attachedLine) {
                 const pos = getPointAlongPath(attachedLine.points, easeProgress);
                 return {
                    ...st,
                    x: pos.x,
                    y: pos.y,
                    rotation: sRot + rotDiff * Math.min(easeProgress * 1.5, 1),
                 };
              } else {
                 return {
                    ...st,
                    x: st.x + (et.x - st.x) * easeProgress,
                    y: st.y + (et.y - st.y) * easeProgress,
                    rotation: sRot + rotDiff * easeProgress,
                 };
              }
            });
            
            setAnimatingTokens(interpolated);
            
            // Wait for React to render
            await new Promise(resolve => setTimeout(resolve, 50));
            
            const uri = stageRef.current.toDataURL({ pixelRatio: exportScale });
            const img = new Image();
            img.src = uri;
            await new Promise(resolve => img.onload = resolve);
            offscreenCtx.clearRect(0, 0, exportWidth, exportHeight);
            offscreenCtx.drawImage(img, 0, 0);
            
            const imageData = offscreenCtx.getImageData(0, 0, exportWidth, exportHeight);
            const palette = quantize(imageData.data, 256, { format: 'rgba4444' });
            const index = applyPalette(imageData.data, palette, 'rgba4444');
            gif.writeFrame(index, exportWidth, exportHeight, { palette, delay });
          }
        }
      }
      
      gif.finish();
      const output = gif.bytes();
      const blob = new Blob([output], { type: 'image/gif' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = \`animation_\${activeMapId}.gif\`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setAnimatingTokens(null);
      setCurrentFrameIndex(originalIndex);
    } catch (e) {
      console.error('Error exporting GIF:', e);
      alert('Failed to export GIF.');
      setAnimatingTokens(null);
    }
  };
`;

code = code.replace(
  /const exportVideo = async \(\) => \{/,
  exportGifCode + '\n  const exportVideo = async () => {'
);

code = code.replace(
  /const recorder = new MediaRecorder\(stream, \{ mimeType: 'video\/webm' \}\);/,
  "const mimeType = MediaRecorder.isTypeSupported('video/mp4') ? 'video/mp4' : 'video/webm';\n      const recorder = new MediaRecorder(stream, { mimeType });"
);

code = code.replace(
  /const blob = new Blob\(chunks, \{ type: 'video\/webm' \}\);/,
  "const blob = new Blob(chunks, { type: mimeType });"
);

code = code.replace(
  /a\.download = \`animation_\$\{activeMapId\}\.webm\`;/,
  "const ext = mimeType === 'video/mp4' ? 'mp4' : 'webm';\n        a.download = `animation_${activeMapId}.${ext}`;"
);

fs.writeFileSync('src/App.tsx', code);
console.log("Updated App.tsx with exportGif and mp4 fallback");
