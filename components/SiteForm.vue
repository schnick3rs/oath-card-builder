<template>
  <v-card>
    <v-card-title>Edit Site Card</v-card-title>
    <v-card-subtitle>[{{card.id}}] site card</v-card-subtitle>
    <v-divider></v-divider>

    <v-card-text>
      <v-row>

        <v-col>

          <v-text-field
            label="Name"
            v-model="card.name"
            dense outlined
          ></v-text-field>

          <v-text-field
            label="Relics"
            v-model="card.relics"
            type="number"
            dense outlined
          ></v-text-field>

          <v-text-field
            label="Relic Recovery Cost"
            v-model="card.relicRecoverCost"
            dense outlined
          ></v-text-field>

          <v-text-field
            label="Capacity"
            v-model="card.capacity"
            type="number"
            dense outlined
          ></v-text-field>

          <v-text-field
            label="Image"
            v-model="card.image"
            dense outlined
            clearable
          ></v-text-field>

        </v-col>

        <v-col cols="5" v-if="preview">
          <site-card
            :name="card.name"
            :image="card.image"
            :relics="card.relics"
            :capacity="card.capacity"
            :relicRecoverCost="card.relicRecoverCost"
            back></site-card>
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
  name: "SiteForm",
  props: {
    preview: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      card: {
        name: 'Some suit name',
        image: 'https://i.pinimg.com/originals/1b/ef/1a/1bef1a983ec32b11db534ca132a7c243.jpg',
        relics: 1,
        capacity: 1,
      },
      builder: {
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
    };
  },
  methods: {
    save() {},
  },
}
</script>

<style scoped>

</style>
