<template>
  <v-row>

    <v-col>
      <v-btn @click="addDemoDenizen">new citizen</v-btn>
    </v-col>

    <v-col>
      <v-card>

        <v-card-title>
          Your Card library
        </v-card-title>

        <v-card-text>
          <v-list>
            <v-list-item v-for="card in library" @click="">
              <v-list-item-avatar>
                <img :src="`/img/icons/suit-${card.suit}.png`">
              </v-list-item-avatar>
              <v-list-item-content>
                {{card.name}}
              </v-list-item-content>
              <v-list-item-action>
                <v-btn icon @click=""><v-icon>mdi-pencil</v-icon></v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card-text>

      </v-card>
    </v-col>

  </v-row>
</template>

<script>
export default {
  name: "index",
  computed: {
    library() {
      return this.$store.getters['library/cardSets'];
    },
  },
  methods: {
    addDemoDenizen() {
      const denizen = { name: 'Random Name', suit: 'arcane' };
      this.$store.commit('library/createDenizen', denizen);
    }
  }
}
</script>

<style scoped>

</style>
