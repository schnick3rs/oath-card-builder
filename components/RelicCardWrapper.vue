<template>
  <relic-card
    :class="{ 'fixed': fixedWidth }"
    :name="card.name"
    :image="card.image"
    :credits="card.credits"
    :defense="card.defense"
    :type="card.type"
    :modifer="card.modifer"
    :cost="card.cost"
    :text="card.text"
    :back="back"
  ></relic-card>
</template>

<script>
export default {
  name: "RelicCardWrapper",
  props: {
    card: Object,
    back: Boolean,
    fixedWidth: {
      type: Boolean,
      default: false,
    },
  }
}
</script>

<style scoped lang="scss">
.fixed {
  height: 57mm;
}
</style>
