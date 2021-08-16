<template>
  <div>
    <div class="help">
      <v-container>
        <v-row>
          <v-col>
            <v-card>
              <v-card-actions>
                <v-btn to="/">< home</v-btn>
              </v-card-actions>
              <v-divider></v-divider>
              <v-card-text>
                To Print this page, print this page and save as PDF. Page Size Should be DIN-A4.
                Enable Background graphics (checkbox)
                This box will not be printed.
                <v-checkbox label="Print with back" v-model="printBack"></v-checkbox>
              </v-card-text>
              <v-btn @click="drawCards()">draw</v-btn>
              <p style="font-family: OathCapital">OathCapital</p>
              <p style="font-family: OathText">OathText</p>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <div class="export-area">
      <canvas id="canvas"></canvas>
    </div>
  </div>
</template>

<script>
import SeoHead from "@/mixins/SeoHead";

const DenizenCardWrapper = () => import( /* webpackChunkName: "DenizenCardWrapper" */ '~/components/DenizenCardWrapper.vue' );
const DenizenCardBack = () => import( /* webpackChunkName: "DenizenCardBack" */ '~/components/DenizenCardBack.vue' );
const RelicCardWrapper = () => import( /* webpackChunkName: "RelicCardWrapper" */ '~/components/RelicCardWrapper.vue' );
const SiteCardWrapper = () => import( /* webpackChunkName: "SiteCardWrapper" */ '~/components/SiteCardWrapper.vue' );
const EdificeCardWrapper = () => import( /* webpackChunkName: "EdificeCardWrapper" */ '~/components/EdificeCardWrapper.vue' );

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

export default {
  name: "deck",
  layout: 'print',
  mixins: [SeoHead],
  data() {
    return {
      printBack: false,
      canvas: undefined,
    };
  },
  head() {
    const title = `Print your cards`;
    let description = `Print your library on DIN A4 and cut them ready to use.`;
    const image = `https://oath-card-builder.herokuapp.com/img/seo/index.png`;
    return {
      ...this.seo(title, description, image),
    }
  },
  mounted() {
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    this.ctx = ctx;
  },
  computed: {
    library() {
      return this.$store.getters['library/cardSets'];
    },
    groupedDeck() {
      return this.library.reduce((groups, card) => {
        const group = card.__type;

        if(!groups[group]) groups[group] = [];

        groups[group].push(card);
        return groups;
      }, {});
    },
    finalDeck() {
      let deck = [];
      this.library.forEach(card => {
        deck.push(card);
        if (card.__type === 'denizen' && this.printBack) {
          deck.push({
            __type: 'denizen-back',
          });
        }
      });
      return deck;
    },
  },
  methods: {
    drawCards() {
      const cardCount = this.finalDeck.length;
      const factor = 4;
      const rows = Math.floor(cardCount / 7)+1;
      const cols = Math.floor(cardCount / rows);
      this.ctx.canvas.width = 57 * 4 * cols;
      this.ctx.canvas.height = 89 * 4 * rows;
      this.ctx.fillStyle = 'rgba(0, 0, 200, 0.25)';
      this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      console.info(`Define area for ${cardCount} cards -> ${rows}x${cols}.`);
      this.finalDeck.forEach((card, index) => {
        const currentRow = Math.floor(index / 7);
        const currentCol = index % 7;
        console.info(`position -> ${currentCol}:${currentRow}`);
        const x = 57 * factor * currentCol;
        const y = 89 * factor * currentRow;
        this.drawCard(card, x, y, factor);
      });
    },
    drawCard(card, x, y, F = 4) {
      console.info(`Draw ${card.name} at ${x}, ${y}, x${F}`);
      const width = 57 * F;
      const height = 89 * F;

      const obj = {
        async drawImages(ctx, images) {
          // return a Promise synchronously
          return new Promise((resolve, reject) => {
            const img = images.shift();
            const imgToDraw = new Image();
            imgToDraw.src = img.src;
            imgToDraw.onload = () => {
              ctx.drawImage(imgToDraw, img.x, img.y, img.w, img.h);
              if (images.length > 0) {
                // resolve with next iteration so we can await all
                resolve(this.drawImages(ctx, images));
              } else {
                //console.log("I - Processing");
                // done
                resolve();
              }
            };
            imgToDraw.onerror = reject;
          });
        },
        async drawImagePropotional(ctx, src, imageX, imageY, w, h, offsetX, offsetY) {
          // return a Promise synchronously
          return new Promise((resolve, reject) => {
            const image = new Image();
            image.src = src;
            image.onload = () => {
              // default offset is center
              offsetX = typeof offsetX === "number" ? offsetX : 0.5;
              offsetY = typeof offsetY === "number" ? offsetY : 0.5;

              // keep bounds [0.0, 1.0]
              if (offsetX < 0) offsetX = 0;
              if (offsetY < 0) offsetY = 0;
              if (offsetX > 1) offsetX = 1;
              if (offsetY > 1) offsetY = 1;

              let iw = image.width,
                ih = image.height,
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
              console.info(`draw background image ${src} ` + cx + ' ' + cy + ' ' + cw + ' ' + ch + ' ' + imageX + ' ' + imageY + ' ' + w + ' ' + h);
              ctx.drawImage(image, cx, cy, cw, ch, imageX, imageY, w, h);
            };
            image.onerror = reject;
          });
        }
      };

      // draw card image
      if (card.image && card.image.length > 0) {
        (async () => { await obj.drawImagePropotional(this.ctx, card.image, x, y, width, height); })();
      }

      // restriction
      if (card.restriction && card.restriction !== 'None') {
        (async () => {
          const image = {
            x: x,
            y: y,
            w: width,
            h: height,
            src: `https://oath-card-builder.herokuapp.com/img/restriction ${card.restriction} ${card.suit}.png`,
          };
          const images = [image];
          await obj.drawImages(this.ctx, images);
        })();
      }

      // draw suit band
      (async () => {
        const image = {
          x: x,
          y: y,
          w: width,
          h: height,
          src: `https://oath-card-builder.herokuapp.com/img/denizen ${card.suit}.png`,
        };
        const images = [image];
        await obj.drawImages(this.ctx, images);

        this.ctx.fillStyle ='white';
        this.ctx.strokeStyle ='white';
        const str = card.name.trim();
        const fontSize = 5*F;
        let nameX = x + 17*F;
        let nameY = y + 12.5*F;
        let previousChar = '';
//        console.info(`[${card.name}] write name at ${nameX}:${nameY}`);
        //this.ctx.fillText(str, nameX, nameY);
        for (let i = 0; i < str.length; ++i){
          const ch = str.charAt(i);
          this.ctx.font = i === 0 || previousChar === ' '
            ? `${fontSize}px OathCapital`
            : `${fontSize}px OathText`;
          this.ctx.fillText(ch, nameX, nameY);
          nameX += this.ctx.measureText(ch).width;
          previousChar = ch;
        }
      })();

      // draw type box
      (async () => {
        const image = {
          x: x,
          y: y,
          w: width,
          h: height,
          src: `https://oath-card-builder.herokuapp.com${typeMap[card.type]}`,
        };
        const images = [image];
        await obj.drawImages(this.ctx, images);

        // write text
        const fontSize = 3.5*F;
        this.ctx.font = `${fontSize}px OathText`;
        this.ctx.fillStyle = 'black';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        const bounds = card.type.startsWith('instant-') ? width-14*F : width-15.5*F;
        const boxY = card.type.startsWith('instant-') ? height - fontSize*6 : height - fontSize*5;
        this.ctx.fillText(card.text, x, y + boxY);
      })();

      // draw card modifer
      if (card.modifer) {
        (async () => {
          const image = {
            x: x,
            y: y,
            w: width,
            h: height,
            src: `https://oath-card-builder.herokuapp.com/img/action modifer ${card.modifer}.png`,
          };
          const images = [image];
          await obj.drawImages(this.ctx, images);
        })();
      }

      // write costs
      if (card.cost) {

      }



    },
    dynamicCard(cardType) {
      switch (cardType) {
        case 'denizen': return DenizenCardWrapper;
        case 'denizen-back': return DenizenCardBack;
        case 'edifice': return EdificeCardWrapper;
        case 'relic': return RelicCardWrapper;
        case 'site': return SiteCardWrapper;
        default:
          return null;
      }
    },
  },
}
</script>

<style scoped lang="scss">
@media screen {
  .help {
  }
}

@media print {
  .help {
    display: none;
  }
}
</style>
