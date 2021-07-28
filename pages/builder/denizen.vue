<template>
  <v-row>
    <v-col :cols="6">
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
    </v-col>

    <v-col>
      <denizen-card
        :name="denizen.name"
        :image="denizen.image"
        :suit="denizen.suit"
        :type="denizen.type"
        :modifer="denizen.modifer"
        :restriction="denizen.restriction"
        :cost="denizen.cost"
        :text="denizen.text"
        back
      ></denizen-card>
    </v-col>

  </v-row>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      builder: {
        denizen: {
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
          suits: [
            { text: 'Arcane', value: 'arcane' },
            { text: 'Beast', value: 'beast' },
            { text: 'Discord', value: 'discord' },
            { text: 'Hearth', value: 'hearth' },
            { text: 'Nomad', value: 'nomad' },
            { text: 'Order', value: 'order' },
            { text: 'Clockwork (uofficial)', value: 'clockwork' },
          ],
        },
      },
      denizen: {
        name: 'Errand Boy',
        suit: 'beast',
        restriction: null,
        type: 'power-modifer',
        modifer: 'search',
        cost: '1',
        text: 'You may draw from a discard pile in a different region instead of yours.',
        image: 'https://images.unsplash.com/photo-1438283173091-5dbf5c5a3206?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
      }
    }
  }
}
</script>

<style scoped>

</style>
