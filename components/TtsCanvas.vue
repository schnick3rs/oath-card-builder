<template>
  <div>
    <v-card>
      <v-card-title>
        {{name}}
      </v-card-title>
      <v-card-text>
        <p>{{percentage}} % of cards loaded</p>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="drawCards">generate </v-btn>
        <v-btn
          :disabled="!ttsPng"
          :download="`oath-fan-deck-${name}.png`"
          :href="ttsPng"
        >
          download
        </v-btn>
      </v-card-actions>
    </v-card>
    <canvas :id="name"></canvas>
  </div>
</template>

<script>
export default {
  name: 'TtsCanvas',
  props: {
    name: String,
    deck: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      ctx: undefined,
      canvas: undefined,
      ttsPng: undefined,
      loadedCards: 0,
    };
  },
  mounted() {
    let canvas = document.getElementById(this.name);
    this.ctx = canvas.getContext('2d');
  },
  computed: {
    percentage() {
      return ((this.loadedCards / this.finalDeck.length) * 100).toFixed(0);
    },
    finalDeck() {
      return this.deck
        .sort((a, b) => a.name - b.name )
        .sort((a, b) => a.suit - b.suit );
    },
  },
  methods: {
    getExportString(card) {
      const shortCard = { __type: 'denizen', ...card };
      const jsonString = JSON.stringify(shortCard);
      return Buffer.from(jsonString, 'utf8').toString('base64');
    },
    drawCards() {

      this.loadedCards = 0;
      this.ttsPng = null;

      const F = 5;

      const cardCount = this.finalDeck.length;
      const rows = Math.floor(cardCount / 7)+1;
      const cols = Math.min(cardCount, 7);
      this.ctx.canvas.width = 57 * F * cols;
      this.ctx.canvas.height = 89 * F * rows;
      this.ctx.fillStyle = 'rgba(0, 0, 200, 0.25)';
      this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      console.info(`Define area for ${cardCount} cards -> ${rows}x${cols}.`);

      const loadImage = (url) => {
        return new Promise((resolve, reject) => {
          const image = new Image();
          image.onload = () => {
            this.loadedCards++;
            resolve(image);
          };
          image.onerror = () => reject(new Error(`load ${url} fail`));
          image.src = url;
        });
      };

      const drawImage = (image) => {
        // And this is the key to this solution
        // Always remember to make a copy of original object, then it just works :)
        const myImage = Object.assign({}, image);
        return loadImage(myImage.src).then((img) => {

          this.ctx.drawImage(img, myImage.x, myImage.y, myImage.w, myImage.h);
        });
      }

      const cards = this.finalDeck.map((card, index) => {
        const currentRow = Math.floor(index / 7);
        const currentCol = index % 7;
        const x = 57 * F * currentCol;
        const y = 89 * F * currentRow;
        const slug = this.getExportString(card);
        const src = `/api/canvas/${slug}/preview.png`;
        return {
          src,
          x,
          y,
          w: 57 * F,
          h: 89 * F,
        }
      });


      const imagePromises = this.finalDeck.map((card) => {
        const slug = this.getExportString(card);
        const src = `/api/canvas/${slug}/preview.png`;
        return loadImage(src);
      });

      Promise.all(imagePromises).then((images) => {
        images.forEach((image, index) => {
          const currentRow = Math.floor(index / 7);
          const currentCol = index % 7;
          const x = 57 * F * currentCol;
          const y = 89 * F * currentRow;
          this.ctx.drawImage(image, x, y, 57*F, 89*F);
        });
        this.generatePngString();
      });


    },
    generatePngString() {
      this.ttsPng = this.ctx.canvas.toDataURL("image/png");
    },
  },
}
</script>

<style scoped>

</style>
