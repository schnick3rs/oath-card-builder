const Router = require('express-promise-router');
const { createCanvas, loadImage } = require('canvas')

const router = new Router();

module.exports = router;

function draw() {
  const canvas = createCanvas(200, 200)
  const ctx = canvas.getContext('2d')

  // Write "Awesome!"
  ctx.font = '30px Impact'
  ctx.rotate(0.1)
  ctx.fillText('Awesome!', 50, 100)

  // Draw line under text
  let text = ctx.measureText('Awesome!')
  ctx.strokeStyle = 'rgba(0,0,0,0.5)'
  ctx.beginPath()
  ctx.lineTo(50, 102)
  ctx.lineTo(50 + text.width, 102)
  ctx.stroke()

  return canvas;
}

router.get('/:slug', (request, response) => {

  response.setHeader('Content-Type', 'image/png');
  //response.set('Cache-Control', 'public, max-age=300'); // 5 minutes
  draw().pngStream().pipe(response)
});
