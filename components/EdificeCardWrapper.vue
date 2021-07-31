<template>
  <div>
    <denizen-card
      :edifice="card.front.edifice"
      :name="card.front.name"
      :image="card.front.image"
      :suit="card.front.suit"
      :type="card.front.type"
      :modifer="card.front.modifer"
      :restriction="card.front.restriction"
      :cost="card.front.cost"
      :text="card.front.text"
    ></denizen-card>
    <denizen-card
      :edifice="card.ruined.edifice"
      :name="card.ruined.name"
      :image="card.ruined.image"
      :suit="card.ruined.suit"
      :type="card.ruined.type"
      :modifer="card.ruined.modifer"
      :restriction="card.ruined.restriction"
      :cost="card.ruined.cost"
      :text="card.ruined.text"
    ></denizen-card>
  </div>
</template>

<script>
export default {
  name: "EdificeCardWrapper",
  props: {
    card: Object,
    back: Boolean,
  }
}
</script>

<style scoped>

</style>
