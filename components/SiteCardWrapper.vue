<template>
  <site-card
    :name="card.name"
    :image="card.image"
    :resources="card.resources"
    :relics="card.relics"
    :capacity="card.capacity"
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
  }
}
</script>

<style scoped>

</style>
