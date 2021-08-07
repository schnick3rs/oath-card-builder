<template>
  <site-card
    :class="{ 'fixed': fixedWidth }"
    :name="card.name"
    :image="card.image"
    :resources="card.resources"
    :relics="card.relics"
    :capacity="card.capacity"
    :text="card.text"
    :special="card.special"
    :relicRecoverCost="card.relicRecoverCost"
    :back="back"
  ></site-card>
</template>

<script>
export default {
  name: "SiteCardWrapper",
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
