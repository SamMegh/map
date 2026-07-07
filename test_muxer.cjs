const { Muxer, ArrayBufferTarget } = require('mp4-muxer');
const muxer = new Muxer({
  target: new ArrayBufferTarget(),
  video: {
    codec: 'avc',
    width: 640,
    height: 480
  },
  fastStart: 'in-memory'
});
console.log('Muxer initialized!');
