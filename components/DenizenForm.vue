<template>
  <v-card>
    <v-card-title>Edit Denizen Card</v-card-title>
    <v-card-subtitle>[{{denizen.id}}] {{denizen.suit}} denizen card</v-card-subtitle>
    <v-divider></v-divider>

    <v-card-text>
      <v-row>

        <v-col>

            <v-text-field
              label="Name"
              v-model="denizen.name"
              dense outlined
            ></v-text-field>

            <v-radio-group
              row
              v-model="denizen.suit"
              dense
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

            <v-select
              label="Restriction"
              v-model="denizen.restriction"
              :items="builder.denizen.restrictions"
              clearable
              dense outlined
            ></v-select>

            <v-text-field
              label="Image"
              v-model="denizen.image"
              dense outlined
              clearable
            ></v-text-field>

            <v-text-field
              label="Cost"
              v-model="denizen.cost"
              dense outlined
              persistent-hint
              hint="1/! (favor) 2/@ (secrets)"
            ></v-text-field>

            <v-select
              label="Effect type"
              v-model="denizen.type"
              :items="builder.denizen.typeItems"
              dense outlined
            ></v-select>

            <v-select
              label="Affected Action"
              v-model="denizen.modifer"
              :items="builder.denizen.modifier"
              :disabled="!denizen.type.includes('modifer')"
              dense outlined
            ></v-select>

            <v-textarea
              label="Effect"
              v-model="denizen.text"
              dense outlined
            ></v-textarea>

        </v-col>

        <v-col cols="5" v-if="preview">
            <denizen-card-wrapper :card="denizen"/>
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
  name: "DenizenForm",
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
      denizen: { text: '', type: '' },
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
      this.denizen = Object.assign({}, this.$store.getters['library/card'](this.id));
    },
    save() {
      this.$store.commit('library/saveDenizen', { id: this.denizen.id, denizen: this.denizen });
    }
  }
}
</script>

<style scoped>

</style>
