const Router = require('express-promise-router');
const { createCanvas, loadImage, registerFont } = require('canvas')

const router = new Router();

module.exports = router;

const typeMap = {
  'power': '/img/box minor action.png',
  'power-modifer': '/img/box action modifier.png',
  'persistent': '/img/box persistent.png',
  'persistent-modifer': '/img/box persistent action modifer.png',
  'battleplan-attacker': '/img/box battle plan attacker.png',
  'battleplan-defender': '/img/box battle plan defender.png',
  'battleplan-both': '/img/box battle plan both.png',
  'instant-large': '/img/box when played large.png',
  'instant-medium': '/img/box when played medium.png',
  'instant-small': '/img/box when played small.png',
};

/**
 * By Ken Fyrstenberg Nilsen
 * https://stackoverflow.com/questions/21961839/simulation-background-size-cover-in-canvas/21961894#21961894
 *
 * drawImageProp(context, image [, x, y, width, height [,offsetX, offsetY]])
 *
 * If image and context are only arguments rectangle will equal canvas
 */
function drawImageProp(ctx, img, x, y, w, h, offsetX, offsetY) {

  if (arguments.length === 2) {
    x = y = 0;
    w = ctx.canvas.width;
    h = ctx.canvas.height;
  }

  // default offset is center
  offsetX = typeof offsetX === "number" ? offsetX : 0.5;
  offsetY = typeof offsetY === "number" ? offsetY : 0.5;

  // keep bounds [0.0, 1.0]
  if (offsetX < 0) offsetX = 0;
  if (offsetY < 0) offsetY = 0;
  if (offsetX > 1) offsetX = 1;
  if (offsetY > 1) offsetY = 1;

  var iw = img.width,
    ih = img.height,
    r = Math.min(w / iw, h / ih),
    nw = iw * r,   // new prop. width
    nh = ih * r,   // new prop. height
    cx, cy, cw, ch, ar = 1;

  // decide which gap to fill
  if (nw < w) ar = w / nw;
  if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh;  // updated
  nw *= ar;
  nh *= ar;

  // calc source rectangle
  cw = iw / (nw / w);
  ch = ih / (nh / h);

  cx = (iw - cw) * offsetX;
  cy = (ih - ch) * offsetY;

  // make sure source rectangle is valid
  if (cx < 0) cx = 0;
  if (cy < 0) cy = 0;
  if (cw > iw) cw = iw;
  if (ch > ih) ch = ih;

  // fill image in dest. rectangle
  ctx.drawImage(img, cx, cy, cw, ch,  x, y, w, h);
}

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

function fillContainedText(ctx, text, fontSize, x, y, maxWidth) {
  const words = text.replace(/(\r\n|\n\n|\r)/gm, ' <p> ').split(' ');
  let line = [];
  let lineWidth = 0;
  words.forEach((word, i) => {
    const { width } = ctx.measureText(word);

    if (word.startsWith('**') && word.endsWith('**')) {
      word = word.replace(/\*\*(.*)\*\*/gm, '$1');
      word = word.toUpperCase();
    }

    if (word === '<p>') {
      y += fontSize;
      line = [];
      lineWidth = 0;
    } else if ((lineWidth + width) > maxWidth) {
      console.info(`write ${line.join(' ')} at ${x}:${y} `);
      ctx.fillText(line.join(' '), x, y);
      y += fontSize;
      line = [word];
      lineWidth = width;
    } else {
      line.push(word);
      lineWidth += width;
    }
  });
  if (line.length > 0 ){
    console.info(`write ${line.join(' ')} at ${x}:${y} `);
    ctx.fillText(line.join(' '), x, y);
  }
}

async function drawDenizen(card, F = 7) {
  const width = 57 * F;
  const height = 89 * F;
  let baseUrl = 'https://oath-card-builder.herokuapp.com';

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  const favor = await loadImage('https://oath-card-builder.herokuapp.com/img/icons/favor.png');
  const secret = await loadImage('https://oath-card-builder.herokuapp.com/img/icons/secret.png');
  const favorBurned = await loadImage('https://oath-card-builder.herokuapp.com/img/icons/favor-burned.png');
  const secretBurned = await loadImage('https://oath-card-builder.herokuapp.com/img/icons/secret-burned.png');

  // draw card image
  if (card.image) {
    try {
      const backgroundLayer = await loadImage(card.image);
      drawImageProp(ctx, backgroundLayer, 0, 0, width, height);
    } catch (e) {}
  }

  // restriction
  if (card.restriction) ctx.drawImage(await loadImage( `${baseUrl}/img/restriction ${card.restriction} ${card.suit}.png`), 0, 0, width, height);

  // draw suit band
  ctx.drawImage(await loadImage(`${baseUrl}/img/denizen ${card.suit}.png`), 0, 0, width, height);

  ctx.fillStyle ='white';
  ctx.strokeStyle ='white';
  capitalText(ctx, card.name, 4*F, 17*F, 12.5*F);

  ctx.drawImage(await loadImage( `${baseUrl}${typeMap[card.type]}`), 0, 0, width, height);

  if (card.modifer) {
    ctx.drawImage(await loadImage( `${baseUrl}/img/action modifer ${card.modifer}.png`), 0, 0, width, height);
  }

  if (card.cost) {
    const iconSize = 5*F;
    let costIconCount = card.cost.length;
    const y = height - 25*F;
    let startX = (width - (costIconCount * iconSize)) / 2;
    let delta = 0;
    card.cost.split('').forEach((c) => {
      const x = startX - 5*F;
      switch (c) {
        case '!':
          delta += 5 * F;
          ctx.drawImage(favorBurned, x + delta, y, iconSize, iconSize);
          break;
        case '@':
          delta += 5 * F;
          ctx.drawImage(secretBurned, x + delta, y, iconSize, iconSize);
          break;
        case '1':
          delta += 5 * F;
          ctx.drawImage(favor, x + delta, y, iconSize, iconSize);
          break;
        case '2':
          delta += 5 * F;
          ctx.drawImage(secret, x + delta, y, iconSize, iconSize);
          break;
      }
    });
  }

  const fontSize = 3.5*F;
  ctx.font = `${fontSize}px OathText`;
  ctx.fillStyle = 'black';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  // TODO adjust and height width by "when played"
  console.info(card.type)
  const bounds = card.type.startsWith('instant-') ? width-14*F : width-10*F;
  const boxY = card.type.startsWith('instant-') ? height - fontSize*5 : height - fontSize*5;
  fillContainedText(ctx, card.text, fontSize, width/2, boxY, bounds);

  return canvas;
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
    case 'site': return await drawSite(card);
    case 'denizen': return await drawDenizen(card);
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
