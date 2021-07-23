<template>
  <denizen-card
    :name="denizen.name"
    :image="denizen.image"
    :suit="denizen.suit"
    :type="denizen.type"
    :modifer="denizen.modifer"
    :restriction="denizen.restriction"
    :cost="denizen.cost"
    :text="denizen.text"
    back
  ></denizen-card>
</template>

<script>
export default {
  name: "DenizenCardWrapper",
  props: {
    denizen: Object,
  }
}
</script>

<style scoped>

</style>
