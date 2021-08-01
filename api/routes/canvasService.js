const Router = require('express-promise-router');
const { createCanvas, loadImage } = require('canvas')

const router = new Router();

module.exports = router;

function capitalText(ctx, str, fontSize, x, y){
  let previousChar = '';
  for(let i = 0; i <= str.length; ++i){
    let ch = str.charAt(i);
    ctx.font = i === 0 || previousChar === ' '
      ? `${fontSize}px OathCapital`
      : `${fontSize}px OathText`;
    ctx.fillText(ch, x, y);
    x += ctx.measureText(ch).width;
    previousChar = ch;
  }
}

async function draw(card) {
  const canvas = createCanvas(460, 356)
  const ctx = canvas.getContext('2d')

  const frameLayer = await loadImage('https://oath-card-builder.herokuapp.com/img/site%200%20relics.png');
  const backgroundLayer = await loadImage(card.image);

  ctx.drawImage(backgroundLayer, 0, 0, 460, 356);
  ctx.drawImage(frameLayer, 0, 0, 460, 356);

  ctx.font = '30px sans-serif';
  capitalText(ctx, card.name, 20, 50, 300);

  // Draw line under text
  let text = ctx.measureText('Awesome!')
  ctx.strokeStyle = 'rgba(0,0,0,0.5)'
  ctx.beginPath()
  ctx.lineTo(50, 102)
  ctx.lineTo(50 + text.width, 102)
  ctx.stroke()

  return canvas;
}

router.get('/:slug', async (request, response) => {

  const slug = request.params.slug;

  const cardJson = decodeURIComponent(escape(Buffer.from(slug, 'base64').toString('ascii')));
  const card = JSON.parse(cardJson);

  response.setHeader('Content-Type', 'image/png');
  //response.set('Cache-Control', 'public, max-age=300'); // 5 minutes
  const drawed = await draw(card);
  drawed.pngStream().pipe(response)
});
