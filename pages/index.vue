<template>
  <v-row>

    <v-col :cols="libraryCols">

      <v-btn @click="addDemoDenizen">new Denizen</v-btn>

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
  }
}
</script>

<style scoped>

</style>
