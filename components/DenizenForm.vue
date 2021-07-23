<template>
  <v-card>
    <v-card-title>Define Card</v-card-title>
    <v-card-text>

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
        dense outlined
      ></v-select>

      <v-textarea
        label="Effect"
        v-model="denizen.text"
        dense outlined
      ></v-textarea>

    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "DenizenForm",
  props: {
    denizen: Object,
  },
  data() {
    return {
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
            { text: 'Power (modifier}', value: 'power-modifer' },
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
  }
}
</script>

<style scoped>

</style>
