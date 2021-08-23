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
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-checkbox label="Print with back" v-model="printBack"></v-checkbox>
                <v-checkbox label="Show cutter lines" v-model="showCutter"></v-checkbox>
                <v-checkbox label="Show border blend" v-model="showBlend"></v-checkbox>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <div class="print-area">
    <page v-for="(page, i) in pages" :key="i">
      <template v-for="card in page">
        <component
          :id="i"
          :key="card.id"
          :is="dynamicCard(card.__type)"
          :card="card"
          :show-cutter="showCutter"
          :show-blend="showBlend"
        ></component>
      </template>
    </page>
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
  name: "deck",
  layout: 'print',
  mixins: [SeoHead],
  data() {
    return {
      printBack: false,
      pngUrl: undefined,
      showCutter: true,
      showBlend: true,
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
    sortedLib() {
      if (this.library) {
        return this.library
          .sort((a, b) => { return (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0; })
          .sort((a, b) => { return (a.suit < b.suit) ? -1 : (a.suit > b.suit) ? 1 : 0; });
      }
      return [];
    },
    groupedDeck() {
      return this.sortedLib.reduce((groups, card) => {
        const group = card.__type;

        if(!groups[group]) groups[group] = [];

        groups[group].push(card);
        return groups;
      }, {});
    },
    finalDeck() {
      let deck = [];
      this.sortedLib.forEach(card => {
        deck.push(card);
        if (card.__type === 'denizen' && this.printBack) {
          deck.push({
            __type: 'denizen-back',
          });
        }
      });
      return deck;
    },
    pages() {
      let pages = this.finalDeck.reduce((resultArray, item, index) => {
        const chunkIndex = Math.floor(index/9)

        if(!resultArray[chunkIndex]) {
          resultArray[chunkIndex] = [] // start a new chunk
        }

        resultArray[chunkIndex].push(item)

        return resultArray
      }, []);
      return pages;
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
    domtopng() {
      const node = document.getElementById('2');
      const a = this;

      domtoimage.toPng(node)
        .then(function (dataUrl) {
          console.info(dataUrl)
          a.pngUrl = dataUrl;
        })
        .catch(function (error) {
          console.error('oops, something went wrong!', error);
        });
    }
  }
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
