const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const exportVideoCode = `
  const exportVideo = async () => {
    if (!stageRef.current) return;
    try {
      if (typeof VideoEncoder === 'undefined') {
          alert('VideoEncoder API is not supported in this browser. Please use Chrome or Edge.');
          return;
      }
      
      const { Muxer, ArrayBufferTarget } = await import('mp4-muxer');
      
      const width = stageRef.current.width();
      const height = stageRef.current.height();
      
      // MP4 requires dimensions to be even numbers
      const exportWidth = width % 2 === 0 ? width : width - 1;
      const exportHeight = height % 2 === 0 ? height : height - 1;
      
      const offscreenCanvas = document.createElement('canvas');
      offscreenCanvas.width = exportWidth;
      offscreenCanvas.height = exportHeight;
      const offscreenCtx = offscreenCanvas.getContext('2d', { willReadFrequently: true });
      if (!offscreenCtx) return;
      
      const muxer = new Muxer({
        target: new ArrayBufferTarget(),
        video: {
            codec: 'avc',
            width: exportWidth,
            height: exportHeight
        },
        firstTimestampBehavior: 'offset'
      });

      const videoEncoder = new VideoEncoder({
        output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
        error: e => console.error(e)
      });
      
      videoEncoder.configure({
        codec: 'avc1.42001f',
        width: exportWidth,
        height: exportHeight,
        bitrate: 2_500_000,
        framerate: 30
      });
      
      const fps = 30;
      let frameCount = 0;
      
      setIsPlaying(false);
      setIsLooping(false);
      
      const originalIndex = currentFrameIndex;
      
      const captureAndEncodeFrame = async () => {
          // Wait for React to render the animating tokens
          await new Promise(resolve => setTimeout(resolve, 50));
          
          const uri = stageRef.current.toDataURL({ pixelRatio: 1 });
          const img = new Image();
          img.src = uri;
          await new Promise(resolve => img.onload = resolve);
          
          offscreenCtx.fillStyle = '#111111';
          offscreenCtx.fillRect(0, 0, exportWidth, exportHeight);
          offscreenCtx.drawImage(img, 0, 0, exportWidth, exportHeight);
          
          const timestamp = (frameCount * 1000000) / fps;
          const frame = new VideoFrame(offscreenCanvas, { timestamp });
          videoEncoder.encode(frame);
          frame.close();
          frameCount++;
      };
      
      if (frames.length <= 1) {
          const uri = stageRef.current.toDataURL({ pixelRatio: 1 });
          const img = new Image();
          img.src = uri;
          await new Promise(resolve => img.onload = resolve);
          
          offscreenCtx.fillStyle = '#111111';
          offscreenCtx.fillRect(0, 0, exportWidth, exportHeight);
          offscreenCtx.drawImage(img, 0, 0, exportWidth, exportHeight);
          
          // Record 1 second for single frame
          for (let i = 0; i < fps; i++) {
             const timestamp = (frameCount * 1000000) / fps;
             const frame = new VideoFrame(offscreenCanvas, { timestamp });
             videoEncoder.encode(frame);
             frame.close();
             frameCount++;
          }
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
            await captureAndEncodeFrame();
          }
        }
      }
      
      await videoEncoder.flush();
      muxer.finalize();
      
      const buffer = muxer.target.buffer;
      const blob = new Blob([buffer], { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = \`animation_\${activeMapId}.mp4\`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setAnimatingTokens(null);
      setCurrentFrameIndex(originalIndex);
    } catch (e) {
      console.error('Error exporting video:', e);
      alert('Failed to export video.');
      setAnimatingTokens(null);
    }
  };
`;

code = code.replace(
  /const exportVideo = async \(\) => \{[\s\S]*?alert\('Failed to export video\.'\);\s*isRecordingRef\.current = false;\s*\}\s*\};/m,
  exportVideoCode
);

code = code.replace(
  /const mediaRecorderRef = useRef<MediaRecorder \| null>\(null\);\s*const isRecordingRef = useRef\(false\);\s*useEffect\(\(\) => \{[\s\S]*?\}, \[isPlaying\]\);/,
  ''
);

fs.writeFileSync('src/App.tsx', code);
