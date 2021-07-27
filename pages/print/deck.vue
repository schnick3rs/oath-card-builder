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
      <page v-for="page in pages">
        <template v-for="card in page">
          <denizen-card-wrapper
            v-if="card.__type === 'denizen'"
            :card="card"
          ></denizen-card-wrapper>
          <denizen-card-back v-else-if="card.__type === 'denizen-back'"></denizen-card-back>
        </template>
      </page>
    </div>
  </div>
</template>

<script>
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
    finalDeck() {
      let deck = [];
      this.library.forEach(card => {
        deck.push(card);
        if (this.printBack) {
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
