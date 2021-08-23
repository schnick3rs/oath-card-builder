<template>
  <div>
    <v-dialog
      v-model="loading"
      persistent
      width="300"
    >
      <v-card
        color="primary"
        dark
      >
        <v-card-text>
          Generating image for sharing...
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
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
              </v-card-text>
              <v-card-text>
                <v-slider
                  v-model="factor"
                  min="1"
                  max="4"
                  step="1"
                  thumb-label="always"
                  label="Card Resolution"
                ></v-slider>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  v-for="(deck, name) in groupedDeck"
                  :disabled="deck.length <= 0"
                  @click="downloadPng(`tts-export-area-${name}`, name)"
                >
                  Download {{ name }} ({{deck.length}})
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <div class="print-area" >
      <div  v-for="(deck, name) in groupedDeck">
        {{ name }} cards
        <div :id="`tts-export-area-${name}`" class="type-group">
          <div v-for="(card, index) in deck">
            <component
              :key="card.id"
              :is="dynamicCard(card.__type)"
              :card="card"
              :factor="factor"
            ></component>
            <div v-if="index % 7 === 6" class="break"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SeoHead from "@/mixins/SeoHead";
import domtoimage from 'dom-to-image';

const DenizenCardWrapper = () => import( /* webpackChunkName: "DenizenCardWrapper" */ '~/components/DenizenCardWrapper.vue' );
const DenizenCardBack = () => import( /* webpackChunkName: "DenizenCardBack" */ '~/components/DenizenCardBack.vue' );
const RelicCardWrapper = () => import( /* webpackChunkName: "RelicCardWrapper" */ '~/components/RelicCardWrapper.vue' );
const SiteCardWrapper = () => import( /* webpackChunkName: "SiteCardWrapper" */ '~/components/SiteCardWrapper.vue' );
const EdificeCardWrapper = () => import( /* webpackChunkName: "EdificeCardWrapper" */ '~/components/EdificeCardWrapper.vue' );

export default {
  name: "tts-via-css",
  mixins: [SeoHead],
  data() {
    return {
      printBack: false,
      pngUrl: undefined,
      factor: 2,
      loading: false,
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
  computed: {
    library() {
      return this.$store.getters['library/cardSets'];
    },
    groupedDeck() {
      return this.library.reduce((groups, card) => {
        if (card.__type === 'edifice') {

          {
            const group = 'edifice-intact';
            if(!groups[group]) groups[group] = [];
            groups[group].push({
              __type: 'denizen',
              ...card.front,
              edifice: true,
            });
          }

          {
            const group = 'edifice-ruined';
            if(!groups[group]) groups[group] = [];
            groups[group].push({
              ...card.ruined,
              __type: 'denizen',
            });
          }

        } else {
          const group = card.__type;
          if(!groups[group]) groups[group] = [];
          groups[group].push(card);
        }
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
    downloadPng(id, name) {
      this.loading = true;
      const node = document.getElementById(id);
      const a = this;

      this.cutter = false;

      domtoimage.toBlob(node)
        .then(function (blob) {
          saveAs(blob, `oath-${name}-for-tts.png`);
          a.cutter = true;
          a.loading = false;
        })
        .catch(function (error) {
          console.error('oops, something went wrong!', error);
          a.loading = false;
        });
    }
  }
}
</script>

<style lang="scss">

.print-area {
  width: 800mm;
}

.type-group {
  display: flex;
  flex-wrap: wrap;
}

.break {
  flex-basis: 100%;
  height: 0;
}
</style>
