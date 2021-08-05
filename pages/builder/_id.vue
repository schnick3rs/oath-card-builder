<template>
  <div>
    <v-row>
      <v-col v-if="card">
        <component
          :is="cardWrapper"
          :id="cardId"
          preview
        ></component>
      </v-col>
    </v-row>
  </div>
</template>

<script>
const DenizenForm = () => import( /* webpackChunkName: "DenizenForm" */ '~/components/DenizenForm.vue' );
const EdificeForm = () => import( /* webpackChunkName: "EdificeForm" */ '~/components/EdificeForm.vue' );
const RelicForm = () => import( /* webpackChunkName: "RelicForm" */ '~/components/RelicForm.vue' );
const SiteForm = () => import( /* webpackChunkName: "SiteForm" */ '~/components/SiteForm.vue' );

export default {
  name: "card-editor",
  asyncData({ params }) {
    return {
      cardId: params.id,
    };
  },
  computed: {
    card() {
      return this.$store.getters['library/card'](this.cardId);
    },
    cardWrapper() {
      if (this.card) {
        switch (this.card.__type) {
          case 'denizen': return DenizenForm;
          case 'edifice': return EdificeForm;
          case 'relic': return RelicForm;
          case 'site': return SiteForm;
          default:
            return null;
        }
      }
      return null;
    },
  },
}
</script>

<style scoped>

</style>
