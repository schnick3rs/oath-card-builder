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
        const x = 0 + 57 * factor * currentCol;
        const y = 0 + 89 * factor * currentRow;
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
        }
      };

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
