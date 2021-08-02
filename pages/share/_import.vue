<template>
  <div>
    <component
      :is="dynamicCard(card.__type)"
      :card="card"
      back
    ></component>
  </div>
</template>

<script>
const DenizenCardWrapper = () => import( /* webpackChunkName: "DenizenCardWrapper" */ '~/components/DenizenCardWrapper.vue' );
const RelicCardWrapper = () => import( /* webpackChunkName: "RelicCardWrapper" */ '~/components/RelicCardWrapper.vue' );
const SiteCardWrapper = () => import( /* webpackChunkName: "SiteCardWrapper" */ '~/components/SiteCardWrapper.vue' );
const EdificeCardWrapper = () => import( /* webpackChunkName: "EdificeCardWrapper" */ '~/components/EdificeCardWrapper.vue' );

const s = (key) => {
  const map = {
    'battleplan-both': 'Battleplan',
    'battleplan-attacker': 'Battleplan',
    'battleplan-defender': 'Battleplan',
  };
  return map[key] || key;
}

export default {
  name: "_import",
  asyncData({ params }) {
    const importString = params.import;
    const cardJson = decodeURIComponent(escape(Buffer.from(importString, 'base64').toString('ascii')));
    const card = JSON.parse(cardJson);

    return {
      card,
      importString,
    }
  },
  head() {
    const title = `${this.card.name} - a custom ${this.card.__type} card`;
    let description = this.card.name;

    switch (this.card.__type) {
      case 'denizen': description = `${s(this.card.type)} \n ${this.card.text}`; break;
      case 'site': description = `
          Loadout: ${this.card.relics} Relics \n
          Defense: 1\n
          Capacity: ${this.card.capacity}\n
          Relic Recovery Cost: ${this.card.relicRecoverCost}
        `; break;
      case 'relic': description = `${s(this.card.type)} \n ${this.card.text}`; break;
    }

    const image = `/api/canvas/${this.importString}`;
    return {
      title,
      meta: [
        { hid: 'description', name: 'description', content: description },
        { hid: 'robots', name: 'robots', content: 'noindex,follow' },

        // Open Graph
        { hid: 'og:title', name: 'og:title', content: title },
        { hid: 'og:description', name: 'og:description', content: description },
        { hid: 'og:image', name: 'og:image', content: image },

        // twitter
        { hid: 'twitter:card', name: 'twitter:card', content: 'summary_large_image' },
        { hid: 'twitter:title', name: 'twitter:title', content: title },
        { hid: 'twitter:description', name: 'twitter:description', content: description },
        { hid: 'twitter:image', name: 'twitter:image', content: image },
      ],
    };
  },
  methods: {
    dynamicCard(cardType) {
      switch (cardType) {
        case 'denizen': return DenizenCardWrapper;
        case 'edifice': return EdificeCardWrapper;
        case 'relic': return RelicCardWrapper;
        case 'site': return SiteCardWrapper;
        default:
          return null;
      }
    },
  },
}
</script>

<style scoped>

</style>
