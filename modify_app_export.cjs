const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const exportVideoCode = `
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const isRecordingRef = useRef(false);

  useEffect(() => {
    if (!isPlaying && isRecordingRef.current && mediaRecorderRef.current) {
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
           mediaRecorderRef.current.stop();
        }
      }, 500);
    }
  }, [isPlaying]);

  const exportVideo = async () => {
    if (!stageRef.current) return;
    try {
      const container = document.querySelector('.konvajs-content');
      if (!container) {
          alert('Could not find canvas container');
          return;
      }
      const canvas = container.querySelector('canvas');
      if (!canvas) {
          alert('Could not find canvas');
          return;
      }
      
      const stream = (canvas as any).captureStream(30);
      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      mediaRecorderRef.current = recorder;
      const chunks: Blob[] = [];
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };
      
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = \`animation_\${activeMapId}.webm\`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        isRecordingRef.current = false;
      };
      
      recorder.start();
      isRecordingRef.current = true;
      
      setIsLooping(false);
      setCurrentFrameIndex(0);
      setIsPlaying(true);
    } catch (e) {
      console.error('Error exporting video:', e);
      alert('Failed to export video.');
      isRecordingRef.current = false;
    }
  };
`;

code = code.replace(
  /const exportFramesZip = async \(\) => \{[\s\S]*?alert\('Failed to export frames to ZIP\.'\);\s*\}\s*\};/,
  exportVideoCode
);

code = code.replace(
  /onExportFramesZip=\{exportFramesZip\}/g,
  'onExportFramesZip={exportVideo}'
);

fs.writeFileSync('src/App.tsx', code);
console.log("Updated App.tsx");
