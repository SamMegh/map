export function getPointAlongPath(points: number[], progress: number): { x: number, y: number } {
  if (points.length < 4) {
    if (points.length === 2) return { x: points[0], y: points[1] };
    return { x: 0, y: 0 };
  }
  
  // Calculate total length
  let totalLength = 0;
  const segments = [];
  for (let i = 0; i < points.length - 2; i += 2) {
    const dx = points[i+2] - points[i];
    const dy = points[i+3] - points[i+1];
    const length = Math.sqrt(dx*dx + dy*dy);
    segments.push({ length, dx, dy, startX: points[i], startY: points[i+1] });
    totalLength += length;
  }
  
  const targetLength = totalLength * progress;
  let currentLength = 0;
  
  for (const seg of segments) {
    if (currentLength + seg.length >= targetLength) {
      const segProgress = seg.length === 0 ? 0 : (targetLength - currentLength) / seg.length;
      return {
        x: seg.startX + seg.dx * segProgress,
        y: seg.startY + seg.dy * segProgress
      };
    }
    currentLength += seg.length;
  }
  
  // Fallback to last point
  return {
    x: points[points.length - 2],
    y: points[points.length - 1]
  };
}
