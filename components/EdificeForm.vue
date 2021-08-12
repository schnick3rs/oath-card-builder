<template>
  <v-card>
    <v-card-title>Edit Edifice Card</v-card-title>
    <v-card-subtitle>[{{card.id}}] {{card.front.suit}} edifice card</v-card-subtitle>
    <v-divider></v-divider>

    <v-card-text>
      <v-row>

        <v-col>

          <v-row>
            <v-col>
              <v-text-field
                label="Name (front)"
                v-model="card.front.name"
                dense outlined
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <v-text-field
                label="Image"
                v-model="card.front.image"
                dense outlined
                clearable
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <v-text-field
                label="Credit the image artist"
                v-model="card.front.credits"
                dense outlined
                clearable
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <v-select
                row
                v-model="card.front.suit"
                dense outlined
                label="Suit"
                :items="builder.denizen.suits"
              >
                <template v-slot:item="{ item, on }">
                  <v-list-item @click="on.click">
                    <v-list-item-avatar size="16">
                      <img :src="`/img/icons/suit-${item.value}.png`">
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>{{ item.text }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </template>
              </v-select>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="4">
              <v-text-field
                label="Cost"
                v-model="card.front.cost"
                dense outlined
                persistent-hint
                hint="1/! (favor) 2/@ (secrets)"
              ></v-text-field>
            </v-col>
            <v-col cols="8">
              <v-select
                label="Effect type"
                v-model="card.front.type"
                :items="builder.denizen.typeItems"
                dense outlined
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-select
                label="Affected Action"
                v-model="card.front.modifer"
                :items="builder.denizen.modifier"
                :disabled="!card.front.type.includes('modifer')"
                dense outlined
              ></v-select>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <v-textarea
                label="Effect"
                v-model="card.front.text"
                dense outlined
              ></v-textarea>
            </v-col>
          </v-row>

        </v-col>

        <v-col>

          <v-row>
            <v-col>
              <v-text-field
                label="Name (ruined)"
                v-model="card.ruined.name"
                dense outlined
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <v-text-field
                label="Image"
                v-model="card.ruined.image"
                dense outlined
                clearable
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <v-text-field
                label="Credit the image artist"
                v-model="card.ruined.credits"
                dense outlined
                clearable
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <v-select
                row
                v-model="card.ruined.suit"
                dense outlined
                label="Suit"
                readonly disabled
                :items="builder.denizen.suits"
              >
                <template v-slot:item="{ item, on }">
                  <v-list-item @click="on.click">
                    <v-list-item-avatar size="16">
                      <img :src="`/img/icons/suit-${item.value}.png`">
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>{{ item.text }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </template>
              </v-select>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="4">
              <v-text-field
                label="Cost"
                v-model="card.ruined.cost"
                dense outlined
                persistent-hint
                hint="1/! (favor) 2/@ (secrets)"
              ></v-text-field>
            </v-col>
            <v-col cols="8">
              <v-select
                label="Effect type"
                v-model="card.ruined.type"
                :items="builder.denizen.typeItems"
                dense outlined
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-select
                label="Affected Action"
                v-model="card.ruined.modifer"
                :items="builder.denizen.modifier"
                :disabled="!card.ruined.type.includes('modifer')"
                dense outlined
              ></v-select>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <v-textarea
                label="Effect"
                v-model="card.ruined.text"
                dense outlined
              ></v-textarea>
            </v-col>
          </v-row>

        </v-col>

        <v-col cols="5" v-if="preview">
          <edifice-card-wrapper :card="card" />
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
    },
    mode: {
      type: String,
      default: 'denizen',
    },
  },
  data() {
    return {
      card: {
        front: {
          edifice: true,
          name: 'Spraling Rampart',
          image: 'https://www.malerei-walkowiak.de/wp-content/uploads/2016/10/demo.png',
          credits: '',
          suit: 'order',
          restriction: 'site locked',
          type: 'persistent-modifer',
          modifer: 'campaign',
          cost: '',
          text: 'Each site ruled by Sprawling\'s Ramparts ruler adds one  \nmore {-} when targeted.',
          back: false
        },
        ruined: {
          edifice: true,
          name: 'Bandit Rampart',
          image: 'https://www.malerei-walkowiak.de/wp-content/uploads/2016/10/demo.png',
          credits: '',
          suit: 'ruined',
          restriction: 'site locked',
          type: 'battleplan-defender',
          modifer: '',
          cost: '',
          text: '> [-2{-}] if this site is targeted.',
          back: false
        },
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
            { text: 'Clockwork (unofficial)', value: 'clockwork' },
            { text: 'Ruined', value: 'ruined' },
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
      this.card = JSON.parse(JSON.stringify(this.$store.getters['library/card'](this.id)));
    },
    save() {
      this.$store.commit('library/saveCard', { id: this.card.id, card: this.card });
      this.load();
    }
  }
}
</script>

<style scoped>

</style>
