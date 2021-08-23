<template>
  <denizen-card
    :style="fixedCardHeight"
    :id="card.id"
    :edifice="card.__type === 'edifice'"
    :name="card.name"
    :image="card.image"
    :credits="card.credits"
    :suit="card.suit"
    :type="card.type"
    :modifer="card.modifer"
    :restriction="card.restriction"
    :cost="card.cost"
    :text="card.text"
    :back="back"
    :factor="factor"
    :show-cutter="showCutter"
    :show-blend="showBlend"
    :enable-sharing="enableSharing"
    :enable-flipping="enableFlipping"
  ></denizen-card>
</template>

<script>
export default {
  name: "DenizenCardWrapper",
  props: {
    card: Object,
    back: Boolean,
    factor: {
      type: Number,
      default: 1,
    },
    enableSharing: Boolean,
    enableFlipping: Boolean,
    showCutter: Boolean,
    showBlend: Boolean,
    fixedWidth: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    fixedCardHeight() {
      if (this.fixedWidth) {
        return {
          'height': `${89*this.factor}mm`,
        };
      }
      return {};
    },
  },
}
</script>

<style lang="scss">
</style>
