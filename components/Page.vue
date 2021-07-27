<template>
  <div class="page din-a4">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "Page"
}
</script>

<style lang="scss">

</style>


<style scoped lang="scss">
.page {
  page-break-inside: avoid;
  padding: 5mm;
}

.din-a4 {
  height: 297mm;
  width: 210mm;
}

.din-a4-showcase {
  width: 317mm;
}
</style>
