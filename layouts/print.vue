<template>
  <Nuxt></Nuxt>
</template>

<script>
export default {
  name: "print"
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

.cutter {
  border-color: red;
  border-width: 0.2mm;
  border-style: dashed;
}

</style>
