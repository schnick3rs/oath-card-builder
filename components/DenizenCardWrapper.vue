<template>
  <denizen-card
    :class="{ 'fixed': fixedWidth }"
    :edifice="card.edifice"
    :name="card.name"
    :image="card.image"
    :suit="card.suit"
    :type="card.type"
    :modifer="card.modifer"
    :restriction="card.restriction"
    :cost="card.cost"
    :text="card.text"
    :back="back"
  ></denizen-card>
</template>

<script>
export default {
  name: "DenizenCardWrapper",
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
  height: 89mm;
}
</style>
