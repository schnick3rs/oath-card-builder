<template>
  <v-row>

    <v-col :cols="libraryCols">

      <v-btn @click="newDenizen">new Denizen</v-btn>
      <v-btn @click="newEdifice">new Edifice</v-btn>
      <v-btn @click="newRelic">new Relic</v-btn>
      <v-btn @click="newSite">new Site</v-btn>
      <v-file-input
        v-model="csv"
        @change="importDenizen"
        label="import Denizen"
        dense outlined
      ></v-file-input>

      <v-card>

        <v-card-title>
          Your Card library
        </v-card-title>

        <v-card-text>
          <v-list dense>
            <v-list-item
              v-for="card in library"
              @click="openCardEditor(card.id, card.__type)"
            >
              <v-list-item-avatar>
                <img :src="`/img/icons/suit-${card.suit || card.front.suit}.png`">
              </v-list-item-avatar>
              <v-list-item-content>
                {{card.name || card.front.name }}
                <v-list-item-subtitle>
                  {{card.__type}}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn
                  icon
                  @click="removeCard(card.id)"
                >
                  <v-icon color="error">mdi-delete</v-icon>
                </v-btn>
              </v-list-item-action>
              <v-list-item-action v-show="false">
                <v-btn
                  icon
                  @click="openCardEditor(card.id, card.__type)"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card-text>

      </v-card>
    </v-col>

    <v-col v-if="selectedCardId">
      <component
        :is="dynamicForm(selectedCard.__type)"
        :id="selectedCardId"
        preview
      ></component>
    </v-col>

  </v-row>
</template>

<script>
const DenizenForm = () => import( /* webpackChunkName: "DenizenForm" */ '~/components/DenizenForm.vue' );
const EdificeForm = () => import( /* webpackChunkName: "EdificeForm" */ '~/components/EdificeForm.vue' );
const RelicForm = () => import( /* webpackChunkName: "RelicForm" */ '~/components/RelicForm.vue' );
const SiteForm = () => import( /* webpackChunkName: "SiteForm" */ '~/components/SiteForm.vue' );

export default {
  name: "index",
  data() {
    return {
      card: {},
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
      return 4;
    },
    selectedCardId() {
      return this.card?.id || undefined;
    },
    selectedCard() {
      return {...this.$store.getters['library/card'](this.selectedCardId)};
    },
    previewDenizen() {
      return this.$store.getters['library/card'](this.selectedCardId);
    },
  },
  methods: {
    dynamicForm(cardType) {
      switch (cardType) {
        case 'denizen': return DenizenForm;
        case 'edifice': return EdificeForm;
        case 'relic': return RelicForm;
        case 'site': return SiteForm;
        default:
          return null;
      }
    },
    newDenizen() {
      const denizen = { name: 'Random Name', suit: 'arcane' };
      this.$store.commit('library/createDenizen', denizen);
    },
    newEdifice() {
      const edifice = { name: 'Random Name', suit: 'arcane' };
      this.$store.commit('library/createEdifice', edifice);
    },
    newRelic() {
      const relic = { name: 'Random Name', defense: 2 };
      this.$store.commit('library/createRelic', relic);
    },
    newSite() {
      const relic = { name: 'Random Site', relics: 1, capacity: 2 };
      this.$store.commit('library/createSite', relic);
    },
    openCardEditor(cardId, cardType) {
      this.card = this.$store.getters['library/card'](cardId);
    },
    removeCard(cardId) {
      this.card = undefined;
      this.$store.commit('library/deleteCard', cardId);
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
