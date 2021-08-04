<template>
  <relic-card
    style="height: 57mm"
    :name="card.name"
    :image="card.image"
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
  }
}
</script>

<style scoped>

</style>
