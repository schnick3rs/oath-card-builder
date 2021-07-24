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

@font-face {
  font-family: 'OathText';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url('~assets/fonts/Goudy Old Style Regular.ttf') format('truetype');
}

@font-face {
  font-family: 'OathCapital';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url('~assets/fonts/Goudy Text MT Lombardic Capitals.otf') format('opentype');
}

@font-face {
  font-family: 'OathSymbols';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url('~assets/fonts/Oath-Symbols.otf') format('opentype');
}
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
