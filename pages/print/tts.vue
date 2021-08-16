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
                Create a large PNG usable for TTS.
              </v-card-text>
              <v-btn @click="drawCards()">generate TTS export png</v-btn>
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
      this.library
        .filter(card => ['denizen', 'edifice'].includes(card.__type))
        .forEach(card => {
          switch (card.__type) {
            case 'edifice':
              deck.push(card.front);
              deck.push(card.ruined);
              break;
            default:
              deck.push(card);
          }
        });
      return deck;
    },
  },
  methods: {
    getExportString(card) {
      const shortCard = { __type: 'denizen', ...card };
      const jsonString = JSON.stringify(shortCard);
      return Buffer.from(jsonString, 'utf8').toString('base64');
    },
    drawCards() {

      const cardCount = this.finalDeck.length;
      const factor = 4;
      const rows = Math.floor(cardCount / 7)+1;
      const cols = Math.min(cardCount, 7);
      this.ctx.canvas.width = 57 * 4 * cols;
      this.ctx.canvas.height = 89 * 4 * rows;
      this.ctx.fillStyle = 'rgba(0, 0, 200, 0.25)';
      this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      console.info(`Define area for ${cardCount} cards -> ${rows}x${cols}.`);

      this.finalDeck.forEach((card, index) => {
        const currentRow = Math.floor(index / 7);
        const currentCol = index % 7;
        const x = 57 * factor * currentCol;
        const y = 89 * factor * currentRow;
        const slug = this.getExportString(card);
        const src = `/api/canvas/${slug}/preview.png`;
        try {
          const image = new Image();
          image.src = src;
          image.onload = () => {
            this.ctx.drawImage(image, x, y, 57 * factor, 89 * factor);
          }
          image.onerror = (e) => {
            console.warn(e);
            const placeholder = new Image();
            placeholder.src = `https://via.placeholder.com/${57*factor}${89*factor}`;
            placeholder.onload = () => {
              this.ctx.drawImage(placeholder, x, y, 57 * factor, 89 * factor);
            }
          }
        } catch (e) {
          console.warn(e);
        }
      });


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
