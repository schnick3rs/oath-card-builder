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
            <v-col cols="6">

              <v-select
                row
                v-model="card.suit"
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
            <v-col cols="6">
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
            <v-col cols="4">
              <v-text-field
                label="Cost"
                v-model="card.cost"
                dense outlined
                persistent-hint
                hint="1/! (favor) 2/@ (secrets)"
              ></v-text-field>
            </v-col>
            <v-col cols="8">
              <v-select
                label="Effect type"
                v-model="card.type"
                :items="builder.denizen.typeItems"
                dense outlined
              ></v-select>
            </v-col>
            <v-col cols="12">
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
              <details>
                <summary>
                  Click to show how to format your code.
                </summary>
                <markdown-reference></markdown-reference>
                <oath-symbol-reference></oath-symbol-reference>
              </details>
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
      <v-text-field
        id="exportSnippet"
        v-model="sharableLink"
        dense outlined
        append-outer-icon="mdi-content-copy"
        @click:append-outer="copyToClipboard"
      ></v-text-field>
      <v-spacer></v-spacer>
      <v-btn color="warning" outlined @click="save">Cancel</v-btn>
      <v-btn color="success" @click="save" :disabled="!hasChanges">Save</v-btn>
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
            { text: 'Clockwork (unofficial)', value: 'clockwork' },
            { text: 'Ruined', value: 'ruined' },
          ],
          restrictions: [
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
      initialHash: null,
    }
  },
  computed: {
    sharableLink() {
      const shortCard = { __type: 'denizen', ...this.card };
      const jsonString = JSON.stringify(shortCard);
      const exportString = Buffer.from(unescape(encodeURIComponent(jsonString)), 'ascii').toString('base64');
      return `https://oath-card-builder.herokuapp.com/share/${exportString}`;
    },
    currentHash() {
      return JSON.stringify(this.card);
    },
    hasChanges() {
      return this.initialHash != this.currentHash;
    },
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
      this.initialHash = JSON.stringify(this.card);
    },
    save() {
      this.$store.commit('library/saveCard', { id: this.card.id, card: this.card });
      this.load();
    },
    copyToClipboard() {
      document.getElementById('exportSnippet').select();
      document.execCommand("copy");
    },
  }
}
</script>

<style scoped>

</style>
