<template>
  <page>
    <denizen-card
      v-for="denizen in denizens"
      :name="denizen.name"
      :image="denizen.image"
      :suit="denizen.suit"
      :type="denizen.type"
      :modifer="denizen.modifer"
      :restriction="denizen.restriction"
      :cost="denizen.cost"
      :text="denizen.text"
    ></denizen-card>
    <relic-card
      v-for="relic in relics"
      :name="relic.name"
      :image="relic.image"
      :defense="relic.defense"
      :type="relic.type"
      :modifer="relic.modifer"
      :cost="relic.cost"
      :text="relic.text"
    ></relic-card>
  </page>
</template>

<script>
import DenizenCard from "@/components/DenizenCard";
import RelicCard from "@/components/RelicCard";

export default {
  name: "index",
  layout: 'print',
  components: {DenizenCard, RelicCard},
  data() {
    return {
      denizens: [
        {
          name: 'Robot Builder',
          suit: 'hearth',
          restriction: null,
          type: 'persistent',
          text: 'Instead of spending or burning {f} and {s} to do a relic´s minor action, you may sacrifice one warband from your board each.',
          image: '',
        },
        {
          name: 'Wrestlers',
          suit: 'order',
          restriction: null,
          type: 'battleplan-defender',
          text: 'if you sacrifice one warband in your force on a {o} site.',
          image: 'https://images.unsplash.com/photo-1524633412778-878453ef0cd7?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        },
        {
          name: 'Alchemist',
          suit: 'arcane',
          restriction: null,
          type: 'power',
          cost: '2@',
          text: '**Action:** Gain {f}{f}{f} and {S} from any favour bank or banks.',
          image: 'https://images.unsplash.com/photo-1527844817887-9b937993518b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1389&q=80',
        },
        {
          name: 'Errand Boy',
          suit: 'beast',
          restriction: null,
          type: 'power-modifer',
          modifer: 'search',
          cost: '1',
          text: 'You may draw from a discard pile in a different region instead of yours.',
          image: 'https://images.unsplash.com/photo-1438283173091-5dbf5c5a3206?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
        },
        {
          name: 'Mercenaries',
          suit: 'discord',
          restriction: 'adviser',
          type: 'battleplan-both',
          cost: '1',
          text: 'You may draw from a discard pile in a different region instead of yours.',
          image: 'https://images.unsplash.com/photo-1438283173091-5dbf5c5a3206?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
        },
        {
          name: 'Tinnker`s Fair',
          suit: 'hearth',
          restriction: 'site locked',
          type: 'power',
          text: 'You may draw from a discard pile in a different region instead of yours.',
          image: 'https://images.unsplash.com/photo-1438283173091-5dbf5c5a3206?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
        },
        {
          name: 'A small Favor',
          suit: 'discord',
          restriction: 'adviser locked',
          type: 'instant-small',
          text: '**When Played**, gain four warbands.',
          image: 'https://images.unsplash.com/photo-1438283173091-5dbf5c5a3206?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
        },
      ],
      relics: [
        {
          name: 'Sticky Fire',
          defense: 2,
          type: 'battleplan-both',
          text: 'If you\'re victorious, you may kill all the warbands in your enemy\'s force. If you do, you must give them {f} if able.',
        },
        {
          name: 'Cursed Cauldron',
          defense: 3,
          type: 'battleplan-both',
          text: 'If you\'re victorious, gain one warband per enemy warband killed in this campaign.',
        },
        {
          name: 'Brass Horse',
          defense: 2,
          type: 'power',
          cost: '2',
          text: '**Action:** Reveal the top card of your discard pile. Travel to a site with a card of this suit. If unable, travel as normal. In either case, spend no Supply.',
        },
        {
          name: 'Truthful Harp',
          defense: 2,
          type: 'power-modifer',
          modifer: 'search',
          text: 'You may choose to draw two more cards. If you do, you **must** reveal every card you draw and the card you keep.',
        },
        {
          name: 'Amulet of conjunction',
          image: 'https://www.vhv.rs/dpng/f/543-5437638_magical-png.png',
          defense: 4,
          type: 'power',
          cost: '12!@',
          text: 'some fancy text',
        },
        {
          name: 'Attack Crown',
          defense: 5,
          type: 'persistent-modifer',
          modifer: 'campaign',
          cost: '+-',
          text: 'You **cannot** place warbands at sites. When mustering, you gain two more warbands.',
        },
      ],
    };
  },
}
</script>
