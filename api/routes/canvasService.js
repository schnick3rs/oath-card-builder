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
  const favor = await loadImage('https://oath-card-builder.herokuapp.com/img/icons/favor.png');
  const secret = await loadImage('https://oath-card-builder.herokuapp.com/img/icons/secret.png');
  const relic = await loadImage('https://oath-card-builder.herokuapp.com/img/icons/relic.png');

  if (card.image) {
    try {
      const backgroundLayer = await loadImage(card.image);
      ctx.drawImage(backgroundLayer, 0, 0, 460, 356);
    } catch (e) {}
  }
  ctx.drawImage(frameLayer, 0, 0, 460, 356);

  // name
  if (card.name) {
    capitalText(ctx, card.name, 30, 110, 335);
  }

  // capacity
  if (card.capacity) {
    ctx.font = '30px OathText';
    ctx.fillText(card.capacity,  410, 60);
  }

  if (card.resources && card.resources.length > 0) {
    let resources = card.resources.split('');
    resources.forEach((c, i) => {
      const icon = c === '1' ? favor : secret;
      const x = 5*F + 3*F*i;
      ctx.drawImage(icon, x, 8*F, 5*F, 5*F);
    });
  }

  for(let i = 0; i < card.relics; i++) {
    const relicOffset = card.resources?.length || 0;
    const x = 5*F + 6*F*i + (relicOffset*20);
    ctx.drawImage(relic, x, 8*F, 5*F, 5*F);
  }

  const relicRecovery = await loadImage('https://oath-card-builder.herokuapp.com/img/icons/relic-recover.png');
  const shared = await loadImage('https://oath-card-builder.herokuapp.com/img/icons/to-favor-bank.png');

  const favorBurned = await loadImage('https://oath-card-builder.herokuapp.com/img/icons/favor-burned.png');
  const secretBurned = await loadImage('https://oath-card-builder.herokuapp.com/img/icons/secret-burned.png');

  const arcane = await loadImage('https://oath-card-builder.herokuapp.com/img/icons/suit-arcane.png');
  const order = await loadImage('https://oath-card-builder.herokuapp.com/img/icons/suit-order.png');
  const beast = await loadImage('https://oath-card-builder.herokuapp.com/img/icons/suit-beast.png');
  const discord = await loadImage('https://oath-card-builder.herokuapp.com/img/icons/suit-discord.png');
  const nomad = await loadImage('https://oath-card-builder.herokuapp.com/img/icons/suit-nomad.png');
  const clockwork = await loadImage('https://oath-card-builder.herokuapp.com/img/icons/suit-clockwork.png');
  const hearth = await loadImage('https://oath-card-builder.herokuapp.com/img/icons/suit-hearth.png');

  if (card.relicRecoverCost) {
    const iconSize = 5*F;
    let costIconCount = card.relicRecoverCost.length;
    let startX = 460 - 10*F - (costIconCount * iconSize);
    let delta = 0;
    card.relicRecoverCost.split('').forEach((c, i) => {
      const x = startX + 10*F - 3*F;
      switch (c) {
        case '!': delta += 3*F; ctx.drawImage(favorBurned, x+delta, 356-(11*F), iconSize, iconSize); break;
        case '@': delta += 3*F; ctx.drawImage(secretBurned, x+delta, 356-(11*F), iconSize, iconSize); break;
        case '1': delta += 3*F; ctx.drawImage(favor, x+delta, 356-(11*F), iconSize, iconSize); break;
        case '2': delta += 3*F; ctx.drawImage(secret, x+delta, 356-(11*F), iconSize, iconSize); break;
        case '>':
        case '=':
          delta += 6*F; ctx.drawImage(shared, x+delta, 356-(11*F), iconSize, iconSize); break;
        case 'a': delta += 6*F; ctx.drawImage(arcane, x+delta, 356-(11*F), iconSize, iconSize); break;
        case 'c': delta += 6*F; ctx.drawImage(clockwork, x+delta, 356-(11*F), iconSize, iconSize); break;
        case 'o': delta += 6*F; ctx.drawImage(order, x+delta, 356-(11*F), iconSize, iconSize); break;
        case 'b': delta += 6*F; ctx.drawImage(beast, x+delta, 356-(11*F), iconSize, iconSize); break;
        case 'n': delta += 6*F; ctx.drawImage(nomad, x+delta, 356-(11*F), iconSize, iconSize); break;
        case 'h': delta += 6*F; ctx.drawImage(hearth, x+delta, 356-(11*F), iconSize, iconSize); break;
        case 'd': delta += 6*F; ctx.drawImage(discord, x+delta, 356-(11*F), iconSize, iconSize); break;
      }
    });
    ctx.drawImage(relicRecovery, startX, 356-(12*F), 8*F, 8*F);
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

router.get('/:slug/preview.png', async (request, response) => {

  const slug = request.params.slug;

  const cardJson = decodeURIComponent(escape(Buffer.from(slug, 'base64').toString('ascii')));
  const card = JSON.parse(cardJson);

  response.setHeader('Content-Type', 'image/png');
  //response.set('Cache-Control', 'public, max-age=300'); // 5 minutes
  const drawed = await draw(card);
  drawed.pngStream().pipe(response)
});

router.get('/:slug/preview.jpg', async (request, response) => {

  const slug = request.params.slug;

  const cardJson = decodeURIComponent(escape(Buffer.from(slug, 'base64').toString('ascii')));
  const card = JSON.parse(cardJson);

  response.setHeader('Content-Type', 'image/jpg');
  //response.set('Cache-Control', 'public, max-age=300'); // 5 minutes
  const drawed = await draw(card);
  drawed.createJPEGStream({quality: 100}).pipe(response)
});
