const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const replacement = `
      const stream = (canvas as any).captureStream(30);
      
      const types = [
        'video/webm;codecs=vp9',
        'video/webm;codecs=vp8',
        'video/webm',
        'video/mp4;codecs=h264',
        'video/mp4'
      ];
      let mimeType = '';
      for (const t of types) {
        if (MediaRecorder.isTypeSupported(t)) {
          mimeType = t;
          break;
        }
      }
      
      if (!mimeType) {
        alert('Video export is not supported in this browser.');
        return;
      }
      
      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      const chunks: Blob[] = [];
      
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const ext = mimeType.includes('mp4') ? 'mp4' : 'webm';
        a.download = \`animation_\${activeMapId}.\${ext}\`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        isRecordingRef.current = false;
      };
`;

code = code.replace(
  /const stream = \(canvas as any\)\.captureStream\(30\);[\s\S]*?recorder\.onstop = \(\) => \{[\s\S]*?isRecordingRef\.current = false;\n      \};\n/m,
  replacement
);

fs.writeFileSync('src/App.tsx', code);
