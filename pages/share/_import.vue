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

export default {
  name: "_import",
  asyncData({ params }) {
    const importString = params.import;
    const cardJson = decodeURIComponent(escape(Buffer.from(importString, 'base64').toString('ascii')));
    console.info(cardJson)
    const card = JSON.parse(cardJson);
    return {
      card,
    }
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
