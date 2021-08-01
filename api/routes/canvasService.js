const Router = require('express-promise-router');
const { createCanvas, loadImage, registerFont } = require('canvas')

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

async function drawSite(card) {

  const F = 4;

  const canvas = createCanvas(460, 356);
  const ctx = canvas.getContext('2d');

  const frameLayer = await loadImage(`https://oath-card-builder.herokuapp.com/img/site 0 relics.png`);
  const backgroundLayer = await loadImage(card.image);
  const favor = await loadImage('https://oath-card-builder.herokuapp.com/img/icons/favor.png');
  const secret = await loadImage('https://oath-card-builder.herokuapp.com/img/icons/secret.png');
  const relic = await loadImage('https://oath-card-builder.herokuapp.com/img/icons/relic.png');

  ctx.drawImage(backgroundLayer, 0, 0, 460, 356);
  ctx.drawImage(frameLayer, 0, 0, 460, 356);

  // name
  capitalText(ctx, card.name, 30, 110, 335);

  // capacity
  ctx.fillText(card.capacity,  410, 60);

  let resources = card.resources.split('');
  resources.forEach((c, i) => {
    const icon = c === '1' ? favor : secret;
    const x = 5*F + 3*F*i;
    ctx.drawImage(icon, x, 8*F, 5*F, 5*F);
  });

  for(let i = 0; i < card.relics; i++) {
    const x = 5*F + 6*F*i + (resources.length*20);
    ctx.drawImage(relic, x, 8*F, 5*F, 5*F);
  }

  return canvas;
}

async function draw(card) {
  registerFont('goudy_old_style_regular-webfont.ttf', { family: 'OathText' });
  registerFont('goudy_text_mt_lombardic_capitals-webfont.ttf', { family: 'OathCapital' });

  switch (card.__type) {
    case 'site':
      return await drawSite(card);
    default:
      return;
  }
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
