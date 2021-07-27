<template>
  <div class="denizen cutter">
    <div class="layer back"></div>
  </div>
</template>

<script>
export default {
  name: "DenizenCardBack"
}
</script>

<style scoped lang="scss">
.denizen {
  overflow: hidden;
  position: relative;
  float: left;
  display: block;
  page-break-inside: avoid;

  height: 89mm;
  width: 57mm;
}

.layer {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
  clip-path: inset(1.5mm 1.5mm 1.5mm 1.5mm round 3mm);
}

.back {
  background-image: url('/img/denizen card back.png');
}
</style>
