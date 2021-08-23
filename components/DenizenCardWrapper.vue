<template>
  <denizen-card
    :class="{ 'fixed': fixedWidth }"
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
  ></denizen-card>
</template>

<script>
export default {
  name: "DenizenCardWrapper",
  props: {
    card: Object,
    back: Boolean,
    factor: Number,
    fixedWidth: {
      type: Boolean,
      default: false,
    },
  }
}
</script>

<style scoped lang="scss">
.fixed {
  height: 89mm;
}
</style>
