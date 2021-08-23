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
    :factor="factor"
    :show-cutter="showCutter"
    :show-blend="showBlend"
    :enable-sharing="enableSharing"
    :enable-flipping="enableFlipping"
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
    factor: {
      type: Number,
      default: 1,
    },
    enableSharing: Boolean,
    enableFlipping: Boolean,
    showCutter: Boolean,
    showBlend: Boolean,
  }
}
</script>

<style scoped lang="scss">
.fixed {
  height: 57mm;
}
</style>
