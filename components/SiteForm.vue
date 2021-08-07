<template>
  <v-card>
    <v-card-title>Edit Site Card</v-card-title>
    <v-card-subtitle>[{{card.id}}] site card</v-card-subtitle>
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
                label="Recoverable Resources"
                v-model="card.resources"
                dense outlined
                persistent-hint hint="1 (favor) 2 (secret)"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                label="Relics"
                v-model.number="card.relics"
                type="number"
                min="0"
                max="3"
                dense outlined
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                label="Capacity"
                v-model.number="card.capacity"
                type="number"
                dense outlined
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <v-text-field
                label="Relic Recovery Cost"
                v-model="card.relicRecoverCost"
                dense outlined
                persistent-hint hint="1 or ! (favor) @ (secret) > [a]rcane [o]rder ... "
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
              <v-textarea
                label="Special Power Text"
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
          <site-card
            :name="card.name"
            :image="card.image"
            :resources="card.resources"
            :relics="card.relics"
            :capacity="card.capacity"
            :text="card.text"
            :relicRecoverCost="card.relicRecoverCost"
            back></site-card>
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
      <v-btn color="success" @click="save">Save</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "SiteForm",
  props: {
    id: String,
    preview: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      card: {
        name: 'Floating City',
        image: 'https://i.pinimg.com/originals/1b/ef/1a/1bef1a983ec32b11db534ca132a7c243.jpg',
        resources: '2',
        relics: 1,
        capacity: 2,
        relicRecoverCost: '111>a',
      },
      builder: {
        suits: [
          { text: 'Arcane', value: 'arcane' },
          { text: 'Beast', value: 'beast' },
          { text: 'Discord', value: 'discord' },
          { text: 'Hearth', value: 'hearth' },
          { text: 'Nomad', value: 'nomad' },
          { text: 'Order', value: 'order' },
          { text: 'Clockwork (unofficial)', value: 'clockwork' },
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
    };
  },
  computed: {
    sharableLink() {
      const shortCard = { __type: 'site', ...this.card };
      const jsonString = JSON.stringify(shortCard);
      const exportString = Buffer.from(unescape(encodeURIComponent(jsonString)), 'ascii').toString('base64');
      return `https://oath-card-builder.herokuapp.com/share/${exportString}`;
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
    },
    save() {
      this.$store.commit('library/saveCard', { id: this.card.id, card: this.card });
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
