<template>
  <div :style="fixedCardHeight">
    <denizen-card
      :id="card.id"
      :edifice="card.__type === 'edifice'"
      :name="card.front.name"
      :image="card.front.image"
      :credits="card.front.credits"
      :suit="card.front.suit"
      :type="card.front.type"
      :modifer="card.front.modifer"
      :restriction="card.front.restriction"
      :cost="card.front.cost"
      :text="card.front.text"
      :factor="factor"
      :show-cutter="showCutter"
      :enable-sharing="enableSharing"
      :enable-flipping="enableFlipping"
    ></denizen-card>
    <denizen-card
      :id="`${card.id}-ruined`"
      :name="card.ruined.name"
      :image="card.ruined.image"
      :credits="card.ruined.credits"
      :suit="card.ruined.suit"
      :type="card.ruined.type"
      :modifer="card.ruined.modifer"
      :restriction="card.ruined.restriction"
      :cost="card.ruined.cost"
      :text="card.ruined.text"
      :factor="factor"
      :show-cutter="showCutter"
      :enable-sharing="enableSharing"
      :enable-flipping="enableFlipping"
    ></denizen-card>
  </div>
</template>

<script>
export default {
  name: "EdificeCardWrapper",
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

<style scoped lang="scss">
</style>
