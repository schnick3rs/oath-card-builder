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
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <div class="print-area">
      <page v-for="page in pages">
        <denizen-card-wrapper
          v-for="card in page"
          :card="card"
          :back="false"
        ></denizen-card-wrapper>
      </page>
    </div>
  </div>
</template>

<script>
export default {
  name: "deck",
  layout: 'print',
  computed: {
    library() {
      return this.$store.getters['library/cardSets'];
    },
    pages() {
      let pages = this.library.reduce((resultArray, item, index) => {
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
