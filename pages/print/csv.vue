<template>
  <div>
    <div class="screen">
      <v-container>
        <v-row dense>
          <v-col cols="4">
            <v-file-input
              label="Csv File"
              dense outlined
              v-model="file"
              accept=".csv"
              @change="parseCsv"
            ></v-file-input>
          </v-col>
        </v-row>
        <v-row v-if="false">
          <v-col>
            <v-card>
              <v-card-subtitle>Type</v-card-subtitle>
              <v-card-text>
                <ul>
                  <li>power</li>
                  <li>power-modifer</li>
                  <li>persistent</li>
                  <li>persistent-modifer</li>
                  <li>battleplan-attacker</li>
                  <li>battleplan-defender</li>
                  <li>battleplan-both</li>
                  <li>instant-small</li>
                  <li>instant-medium</li>
                  <li>instant-large</li>
                </ul>
              </v-card-text>
              <v-card-subtitle>Type Modifer</v-card-subtitle>
              <v-card-text>
                <ul>
                  <li>search</li>
                  <li>travel</li>
                  <li>trade</li>
                  <li>muster</li>
                  <li>campaign</li>
                </ul>
              </v-card-text>
              <v-divider></v-divider>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <page v-for="(page, i) in pages" :key="j">
      <denizen-card-wrapper
        v-for="(card, j) in page"
        :key="j"
        :card="card"
        :back="false"
      ></denizen-card-wrapper>
    </page>
  </div>
</template>

<script>
export default {
  name: "csv",
  layout: 'print',
  data() {
    return {
      file: undefined,
      cards: [],
    };
  },
  computed: {
    pages() {
      let pages = this.cards.reduce((resultArray, item, index) => {
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
    parseCsv() {
      if (this.file) {
        const reader = new FileReader();

        function csvToArray(str, delimiter = ";") {
          // slice from start of text to the first \n index
          // use split to create an array from string by delimiter
          const headers = str.slice(0, str.indexOf("\n")).split(delimiter);

          // slice from \n index + 1 to the end of the text
          // use split to create an array of each csv value row
          const rows = str.slice(str.indexOf("\n") + 1).split("\n");

          // Map the rows
          // split values from each row into an array
          // use headers.reduce to create an object
          // object properties derived from headers:values
          // the object passed as an element of the array
          const arr = rows.map(function (row) {
            const values = row.split(delimiter);
            const el = headers.reduce(function (object, header, index) {
              object[header] = values[index];
              return object;
            }, {});
            return el;
          });

          // return the array
          return arr;
        }

        reader.onload = (e) => {
          const text = e.target.result;
          let data = csvToArray(text);
          this.cards = data.filter(item => item.name !== '' );
        };

        reader.readAsText(this.file);
      }
    },
  },
}
</script>

<style scoped lang="scss">
@media print {
  .screen {
    display: none;
  }
}
</style>
