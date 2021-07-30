<template>
  <v-card>
    <v-card-title>Edit Denizen Card</v-card-title>
    <v-card-subtitle>[{{card.id}}] {{card.suit}} denizen card</v-card-subtitle>
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
          </v-row>

          <v-row>
            <v-col>
              <v-radio-group
                row
                v-model="card.suit"
                dense
                label="Suit"
              >
                <v-radio
                  v-for="suit in builder.denizen.suits"
                  :value="suit.value"
                >
                  <template v-slot:label>
                    <v-avatar size="28">
                      <img :src="`/img/icons/suit-${suit.value}.png`">
                    </v-avatar>
                  </template>
                </v-radio>
              </v-radio-group>
            </v-col>
            <v-col cols="3">
              <v-select
                label="Restriction"
                v-model="card.restriction"
                :items="builder.denizen.restrictions"
                clearable
                dense outlined
              ></v-select>
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
                :items="builder.denizen.typeItems"
                dense outlined
              ></v-select>
            </v-col>
            <v-col>
              <v-select
                label="Affected Action"
                v-model="card.modifer"
                :items="builder.denizen.modifier"
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
            <denizen-card-wrapper :card="card" back />
        </v-col>

      </v-row>
    </v-card-text>

    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="warning" outlined @click="save">Cancel</v-btn>
      <v-btn color="success" @click="save">Save</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "EdificeForm",
  props: {
    id: String,
    //denizen: Object,
    preview: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      card: {
        name: 'Good Boiis!',
        image: 'https://www.malerei-walkowiak.de/wp-content/uploads/2016/10/demo.png',
        suit: 'nomad',
        restriction: 'adviser',
        type: 'power-modifer',
        modifer: 'travel',
        cost: '1',
        text: 'Run by day and night',
        back: true
      },
      builder: {
        denizen: {
          suits: [
            { text: 'Arcane', value: 'arcane' },
            { text: 'Beast', value: 'beast' },
            { text: 'Discord', value: 'discord' },
            { text: 'Hearth', value: 'hearth' },
            { text: 'Nomad', value: 'nomad' },
            { text: 'Order', value: 'order' },
            { text: 'Clockwork (uofficial)', value: 'clockwork' },
          ],
          restrictions: [
            { text: 'None', value: undefined },
            { text: 'Adviser', value: 'adviser' },
            { text: 'Adviser (Locked)', value: 'adviser locked' },
            { text: 'Site', value: 'site' },
            { text: 'Site (Locked)', value: 'site locked' },
          ],
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
      },
    }
  },
  computed: {
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
    }
  }
}
</script>

<style scoped>

</style>
