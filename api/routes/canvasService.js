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

const symbolMap = {
  'f': 'favor',
  '1': 'favor',
  'F': 'favor-burned',
  '!': 'favor-burned',
  's': 'secret',
  '2': 'secret',
  'S': 'secret-burned',
  '@': 'secret-burned',
  '+': 'die-attacker',
  '-': 'die-defender',
  '~': 'die-turn-order', // del deleted in marked renderer
  'a': 'suit-arcane',
  'b': 'suit-beast',
  'c': 'suit-clockwork',
  'd': 'suit-discord',
  'h': 'suit-hearth',
  'n': 'suit-nomad',
  'o': 'suit-order',
  '$': 'die-defender-shield',
  '§': 'die-defender-double',
  '7': 'die-attacker-sword',
  //'&': 'die-attacker-hallow',
  //'*': 'die-attacker-hallow',
  '8': 'die-attacker-hallow',
  '%': 'die-attacker-skull',
  '>': 'to-favor-bank',
  '=': 'to-favor-bank',
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

  let iw = img.width,
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

async function drawSymbol(ctx, symbol, x, y, w, h) {
  const icon = await loadImage(`https://oath-card-builder.herokuapp.com/img/icons/${symbolMap[symbol]}.png`);
  ctx.drawImage(icon, x, y, w, h);
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
  let cleanedText = text.replace(/(\r\n|\n\n|\r)/gm, ' <p> ');
  cleanedText = cleanedText.replace(/([\[\]>])/gm, '');
  cleanedText = cleanedText.replace(/(}{)/gm, '} {');
  cleanedText = cleanedText.replace(/\*\*When played,\*\*/gm, 'WHEN PLAYED,');
  cleanedText = cleanedText.replace(/\*\*Action:\*\*/gm, 'ACTION:');
  cleanedText = cleanedText.replace(/\*\*Rest:\*\*/gm, 'REST:');

  const words = cleanedText.split(' ');
  let line = [];
  let currentLineIndex = 0;
  let lineWidth = 0;
  let symbols = [[],[],[],[],[],[]];//{ 0: [], 1: [], 2: [], 3: [], 4: []};

  words.forEach((word, i) => {
    const { width } = ctx.measureText(word);

    console.info(`line[${currentLineIndex}] word(${word}:${width}) line(${line})`);

    // apply BOLD to word
    if (word.startsWith('**') && word.endsWith('**')) {
      word = word.replace(/\*\*(.*)\*\*/gm, '$1');
      if (word.endsWith(':') || word.endsWith(',')) {
        word = word.toUpperCase();
      }
    }

    // save symbol positions for later
    let symbol = null;
    if (word.startsWith('{') && (word.endsWith('}') || word.endsWith('}.') || word.endsWith('},'))) {
      const symbolX = ctx.measureText(line.join(' ')+' ').width;
      //console.info(`Cache ${word} in line ${currentLineIndex}. Line is ${line.join(' ')}`);
      symbol = {
        word: word.replace(/{(.*)}.?/gm, '$1'),
        x: symbolX,
        y,
        lineWidth: symbolX,
      };
      word = word.replace(/{.*}(.?)/gm, '   $1');
    }

    if (word === '<p>') {
      y += fontSize;
      line = [];
      lineWidth = 0;
      currentLineIndex++;
    } else if ((lineWidth + width) > maxWidth) {
      console.info(`write ${line.join(' ')} at ${x}:${y} `);
      ctx.fillText(line.join(' '), x, y);

      // we update all symbols in this line to know their lines width.
      symbols[currentLineIndex].forEach(s => { s.lineWidth = lineWidth; s.y = y; });

      // we increse the currentl line and
      currentLineIndex++;
      y += fontSize;
      line = [word];
      if (symbol) {
        symbol.x = 0;
        symbols[currentLineIndex].push(symbol);
      }
      lineWidth = width;
    } else {
      line.push(word);
      if (symbol) symbols[currentLineIndex].push(symbol);
      lineWidth += width;
    }
  });

  if (line.length > 0 ){
    console.info(`write ${line.join(' ')} at ${x}:${y} `);
    ctx.fillText(line.join(' '), x, y);
    symbols[currentLineIndex].forEach(s => { s.lineWidth = lineWidth; s.y = y; });
  }
  return symbols;
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
  if (card.image && card.image.length > 0) {
    try {
      const backgroundLayer = await loadImage(card.image);
      drawImageProp(ctx, backgroundLayer, 0, 0, width, height);
    } catch (e) {}
  }

  // restriction
  console.info(`Load restriction image for ${card.restriction}/${card.suit}`);
  if (card.restriction && card.restriction !== 'None') {
    if (card.restriction) ctx.drawImage(await loadImage( `${baseUrl}/img/restriction ${card.restriction} ${card.suit}.png`), 0, 0, width, height);
  }

  // draw suit band
  console.info(`Load suit image for ${card.suit}`);
  ctx.drawImage(await loadImage(`${baseUrl}/img/denizen ${card.suit}.png`), 0, 0, width, height);

  ctx.fillStyle ='white';
  ctx.strokeStyle ='white';
  capitalText(ctx, card.name, 5*F, 17*F, 12.5*F);

  console.info(`Load type image for ${card.type}`);
  ctx.drawImage(await loadImage( `${baseUrl}${typeMap[card.type]}`), 0, 0, width, height);

  console.info(`Load modifer image for ${card.modifer}`)
  if (card.modifer) {
    ctx.drawImage(await loadImage( `${baseUrl}/img/action modifer ${card.modifer}.png`), 0, 0, width, height);
  }

  console.info(`Write text for costs -> ${card.cost}.`);
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

  if (card.text.trim()) {

    const fontSize = 3.5*F;
    ctx.font = `${fontSize}px OathText`;
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const bounds = card.type.startsWith('instant-') ? width-13*F : width-15.5*F;
    let boxY = height - fontSize*5;
    if (card.type.startsWith('instant-')) {
      switch (card.type) {
        case 'instant-small': boxY = height - fontSize*4; break;
        case 'instant-medium': boxY = height - fontSize*5; break;
        case 'instant-large': boxY = height - fontSize*7; break;
        default: boxY = height - fontSize*6;
      }
    }
    let symbols = fillContainedText(ctx, card.text, fontSize, width/2, boxY, bounds);
    if (symbols) {
      console.info(symbols)
      console.info(`Write ${symbols.length} symbols into text placeholders...`);
      for (let i = 0; i < symbols.length; i++) {
        const line = symbols[i];
        for (let j = 0; j < line.length; j++) {
          const symbol = line[j];
          const symbolXOffset = -1 * (symbol.lineWidth/2 - symbol.x);
          const symbolX = width/2 + symbolXOffset;
          const symbolY = symbol.y - fontSize / 2;
          await drawSymbol(ctx, symbol.word, symbolX, symbolY, fontSize, fontSize);
        }
      }
    }
  }

  console.info(`Return denizen canvas.`);
  return canvas;
}

async function drawSite(card, F = 7) {

  const width = 115 * F;
  const height = 89 * F;
  let baseUrl = 'https://oath-card-builder.herokuapp.com';

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  const frameLayer = await loadImage(`${baseUrl}/img/site 0 relics.png`);
  const favor = await loadImage(`${baseUrl}/img/icons/favor.png`);
  const secret = await loadImage(`${baseUrl}/img/icons/secret.png`);
  const relic = await loadImage(`${baseUrl}/img/icons/relic.png`);

  if (card.image && card.image.length > 0) {
    try {
      const backgroundLayer = await loadImage(card.image);
      ctx.drawImage(backgroundLayer, 0, 0, width, height);
    } catch (e) {}
  }
  ctx.drawImage(frameLayer, 0, 0, width, height);

  // name
  if (card.name) {
    capitalText(ctx, card.name, 7*F, 28*F, height - 6*F);
  }

  // capacity
  if (card.capacity) {
    ctx.font = `${7*F}px OathText`;
    ctx.fillText(card.capacity,  width-13*F, 14*F);
  }

  const iconSize = 5*F;
  const resourcesY = 8*F;
  let resourceX = 5*F;
  if (card.resources && card.resources.length > 0) {
    let resources = card.resources.split('');
    resources.forEach((c, i) => {
      const icon = c === '1' ? favor : secret;
      ctx.drawImage(icon, resourceX, resourcesY, iconSize, iconSize);
      resourceX += 3*F;
    });
    // offset from resources to relic
    resourceX += 3*F;
  }

  for(let i = 0; i < card.relics; i++) {
    ctx.drawImage(relic, resourceX, resourcesY, iconSize, iconSize);
    resourceX += iconSize + F;
  }

  const relicRecovery = await loadImage(`${baseUrl}/img/icons/relic-recover.png`);
  const shared = await loadImage(`${baseUrl}/img/icons/to-favor-bank.png`);

  const favorBurned = await loadImage(`${baseUrl}/img/icons/favor-burned.png`);
  const secretBurned = await loadImage(`${baseUrl}/img/icons/secret-burned.png`);

  const arcan = await loadImage(`${baseUrl}/img/icons/suit-arcane.png`);
  const order = await loadImage(`${baseUrl}/img/icons/suit-order.png`);
  const beast = await loadImage(`${baseUrl}/img/icons/suit-beast.png`);
  const disco = await loadImage(`${baseUrl}/img/icons/suit-discord.png`);
  const nomad = await loadImage(`${baseUrl}/img/icons/suit-nomad.png`);
  const clock = await loadImage(`${baseUrl}/img/icons/suit-clockwork.png`);
  const heart = await loadImage(`${baseUrl}/img/icons/suit-hearth.png`);

  if (card.relicRecoverCost) {
    const iconSize = 5*F;
    let costIconCount = card.relicRecoverCost.length;
    let startX = width - 10*F - (costIconCount * iconSize);
    let delta = 0;
    card.relicRecoverCost.split('').forEach((c, i) => {
      const x = startX + 10*F - 3*F;
      const costLineY = height - (11*F);
      switch (c) {
        case '!': delta += 3*F; ctx.drawImage(favorBurned, x+delta, costLineY, iconSize, iconSize); break;
        case '@': delta += 3*F; ctx.drawImage(secretBurned, x+delta, costLineY, iconSize, iconSize); break;
        case '1': delta += 3*F; ctx.drawImage(favor, x+delta, costLineY, iconSize, iconSize); break;
        case '2': delta += 3*F; ctx.drawImage(secret, x+delta, costLineY, iconSize, iconSize); break;
        case '>':
        case '=':
          delta += 6*F; ctx.drawImage(shared, x+delta, costLineY, iconSize, iconSize); break;
        case 'a': delta += 6*F; ctx.drawImage(arcan, x+delta, costLineY, iconSize, iconSize); break;
        case 'b': delta += 6*F; ctx.drawImage(beast, x+delta, costLineY, iconSize, iconSize); break;
        case 'c': delta += 6*F; ctx.drawImage(clock, x+delta, costLineY, iconSize, iconSize); break;
        case 'd': delta += 6*F; ctx.drawImage(disco, x+delta, costLineY, iconSize, iconSize); break;
        case 'o': delta += 6*F; ctx.drawImage(order, x+delta, costLineY, iconSize, iconSize); break;
        case 'h': delta += 6*F; ctx.drawImage(heart, x+delta, costLineY, iconSize, iconSize); break;
        case 'n': delta += 6*F; ctx.drawImage(nomad, x+delta, costLineY, iconSize, iconSize); break;
      }
    });
    ctx.drawImage(relicRecovery, startX, height-(12*F), 8*F, 8*F);
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

  const card = JSON.parse(Buffer.from(slug, 'base64').toString('utf8'));
  console.info(card);

  response.setHeader('Content-Type', 'image/png');
  //response.set('Cache-Control', 'public, max-age=300'); // 5 minutes
  const drawed = await draw(card);
  drawed.createPNGStream().pipe(response)
});

router.get('/:slug/preview.jpg', async (request, response) => {

  const slug = request.params.slug;

  const card = JSON.parse(Buffer.from(slug, 'base64').toString('utf8'));

  response.setHeader('Content-Type', 'image/jpg');
  //response.set('Cache-Control', 'public, max-age=300'); // 5 minutes
  const drawed = await draw(card);
  drawed.createJPEGStream({quality: 100}).pipe(response)
});
