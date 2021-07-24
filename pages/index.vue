<template>
  <v-row>

    <v-col :cols="libraryCols">

      <v-btn @click="addDemoDenizen">new Denizen</v-btn>
      <v-file-input v-model="csv" @change="importDenizen" label="import Denizen" dense outlined></v-file-input>

      <v-card>

        <v-card-title>
          Your Card library
        </v-card-title>

        <v-card-text>
          <v-list dense>
            <v-list-item v-for="card in library" @click="openCardEditor(card.id, card.__type)">
              <v-list-item-avatar>
                <img :src="`/img/icons/suit-${card.suit}.png`">
              </v-list-item-avatar>
              <v-list-item-content>
                {{card.name}}
                <v-list-item-subtitle>
                  {{card.__type}}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn icon @click=""><v-icon>mdi-pencil</v-icon></v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card-text>

      </v-card>
    </v-col>

    <v-col v-if="selectedDenizenId">
      <denizen-form :id="selectedDenizenId" />
    </v-col>

    <v-col v-if="previewDenizen">
      <denizen-card-wrapper :card="previewDenizen" />
    </v-col>

  </v-row>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      denizen: {
        name: 'Errand Boy',
        suit: 'beast',
        restriction: null,
        type: 'power-modifer',
        modifer: 'search',
        cost: '1',
        text: 'You may draw from a discard pile in a different region instead of yours.',
        image: 'https://images.unsplash.com/photo-1438283173091-5dbf5c5a3206?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
      },
      csv: undefined,
      csvData: [],
    };
  },
  computed: {
    library() {
      return this.$store.getters['library/cardSets'];
    },
    libraryCols() {
      return 3;
    },
    selectedDenizenId() {
      return this.denizen.id;
    },
    previewDenizen() {
      return this.$store.getters['library/card'](this.selectedDenizenId);
    },
  },
  methods: {
    addDemoDenizen() {
      const denizen = { name: 'Random Name', suit: 'arcane' };
      this.$store.commit('library/createDenizen', denizen);
    },
    openCardEditor(cardId, cardType) {
      this.denizen = this.$store.getters['library/card'](cardId);
    },
    importDenizen() {
      if (this.csv) {
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
          this.csvData = data.filter(item => item.name !== '');
          this.csvData.forEach(card => {
            this.$store.commit('library/createDenizen', card);
          })
        };

        reader.readAsText(this.csv);

        console.info(this.csvData)

      }
    },
  }
}
</script>

<style scoped>

</style>
