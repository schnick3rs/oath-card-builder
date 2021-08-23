<template>
  <v-card>
    <v-card-title>Edit Relic Card</v-card-title>
    <v-card-subtitle>[{{card.id}}] <em>{{card.text}}</em></v-card-subtitle>
    <v-divider></v-divider>

    <v-card-text>
      <v-row>

        <v-col>

          <v-row>
            <v-col>
              <v-text-field
                label="Name"
                v-model="card.name"
                dense outlined
              ></v-text-field>
            </v-col>
            <v-col>
              <v-slider
                v-model="card.defense"
                label="Defense dice"
                min="1" max="5" step="1"
                ticks="always"
                tick-size="4"
                dense
              ></v-slider>
            </v-col>
            <v-col v-show="false">
              <v-text-field
                label="Defense dice"
                v-model.number="card.defense"
                type="number"
                min="1"
                max="5"
                dense outlined
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <v-text-field
                label="Image"
                v-model="card.image"
                dense outlined
                clearable
              ></v-text-field>
            </v-col>

            <v-col>
              <v-text-field
                label="Credit the image artist"
                v-model="card.credits"
                dense outlined
                clearable
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <v-text-field
                label="Cost"
                v-model="card.cost"
                dense outlined
                persistent-hint
                hint="1/! (favor) 2/@ (secrets)"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-select
                label="Effect type"
                v-model="card.type"
                :items="builder.typeItems"
                dense outlined
              ></v-select>
            </v-col>
            <v-col>
              <v-select
                label="Affected Action"
                v-model="card.modifer"
                :items="builder.modifier"
                :disabled="!card.type.includes('modifer')"
                dense outlined
              ></v-select>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <v-textarea
                label="Effect"
                v-model="card.text"
                dense outlined
              ></v-textarea>
            </v-col>
          </v-row>

        </v-col>

        <v-col cols="5" v-if="preview">
          <v-row>
            <v-slider
              v-model="factor"
              min="1"
              max="4"
              step="1"
              thumb-label="always"
              label="Card Resolution Factor"
            ></v-slider>
          </v-row>
          <v-row>
            <relic-card-wrapper
              :card="card"
              :factor="factor"
              back
            ></relic-card-wrapper>
          </v-row>
        </v-col>

      </v-row>
    </v-card-text>

    <v-divider></v-divider>
    <v-card-actions>

      <v-spacer></v-spacer>
      <v-btn color="warning" outlined @click="">Cancel</v-btn>
      <v-btn color="success" @click="save">Save</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "RelicForm",
  props: {
    id: String,
    preview: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      factor: 1,
      card: {
        name: 'Dowsing Sticks',
        image: 'https://www.malerei-walkowiak.de/wp-content/uploads/2016/10/demo.png',
        credits: '',
        defense: 3,
        type: 'power',
        modifer: '',
        text: '**Action:** Draw a relic. Take it or put it on the bottom of the relic deck.',
        cost: '2!!',
      },
      builder: {
        typeItems: [
          { text: 'Power', value: 'power' },
          { text: 'Power (modifier)', value: 'power-modifer' },
          { text: 'Persistent', value: 'persistent' },
          { text: 'Persistent (modifier)', value: 'persistent-modifer' },
          { text: 'Battleplan (Attacker)', value: 'battleplan-attacker' },
          { text: 'Battleplan (Defender)', value: 'battleplan-defender' },
          { text: 'Battleplan (Both)', value: 'battleplan-both' },
          { text: 'When played (small)', value: 'instant-small' },
          { text: 'When played (medium)', value: 'instant-medium' },
          { text: 'When played (large)', value: 'instant-large' },
        ],
        modifier: [
          { text: 'Travel', value: 'travel' },
          { text: 'Search', value: 'search' },
          { text: 'Trade', value: 'trade' },
          { text: 'Recover', value: 'recover' },
          { text: 'Muster', value: 'muster' },
          { text: 'Campaign', value: 'campaign' },
        ],
      },
    };
  },
  watch: {
    id: {
      handler(newValue) {
        if (newValue) {
          this.load();
        }
      },
      immediate: true,
    },
  },
  methods: {
    load() {
      this.card = Object.assign({}, this.$store.getters['library/card'](this.id));
    },
    save() {
      this.$store.commit('library/saveCard', { id: this.card.id, card: this.card });
    },
  }
}
</script>

<style scoped>

</style>
