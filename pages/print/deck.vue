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
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <div class="print-area">
      <page v-for="(page, i) in pages" :key="i">
        <template v-for="card in page">
          <component
            :key="card.id"
            :is="dynamicCard(card.__type)"
            :card="card"
          ></component>
        </template>
      </page>
    </div>
  </div>
</template>

<script>
const DenizenCardWrapper = () => import( /* webpackChunkName: "DenizenCardWrapper" */ '~/components/DenizenCardWrapper.vue' );
const DenizenCardBack = () => import( /* webpackChunkName: "DenizenCardBack" */ '~/components/DenizenCardBack.vue' );
const RelicCardWrapper = () => import( /* webpackChunkName: "RelicCardWrapper" */ '~/components/RelicCardWrapper.vue' );
const SiteCardWrapper = () => import( /* webpackChunkName: "SiteCardWrapper" */ '~/components/SiteCardWrapper.vue' );
const EdificeCardWrapper = () => import( /* webpackChunkName: "EdificeCardWrapper" */ '~/components/EdificeCardWrapper.vue' );

export default {
  name: "deck",
  layout: 'print',
  data() {
    return {
      printBack: false,
    };
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
