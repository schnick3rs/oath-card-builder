<template>
  <div>

    <div class="site cutter">

      <div v-if="image" class="layer layer-image" :style="cardImage"></div>

      <img class="layer" :src="relicFrame"/>

      <div class="recoverables">
        <div class="resources">
          <template v-for="(n, index) in resources">
            <oath-symbol :symbol="n" size="17" class="resource" />
          </template>
        </div>
        <img
          v-if="relics > 0"
          v-for="n in relics"
          src="/img/icons/relic.png"
          style="height: 5mm; margin-right: 1mm;"
        >
      </div>

      <span class="capacity">{{capacity}}</span>

      <div v-if="name" class="name">
        <span class="name__word" v-for="word in name.split(' ')">{{word}} </span>
      </div>

      <div v-if="relicRecoverCost" class="cost symbol">
        <img src="/img/icons/relic-recover.png" style="height: 20px;">
        <oath-symbol :symbol="c" v-for="c in relicRecoverCosts" :size="18"></oath-symbol>
      </div>

    </div>

    <site-card-back v-if="back"></site-card-back>
  </div>
</template>

<script>
export default {
  name: "SuitCard",
  props: {
    name: String,
    image: String,
    defense: {
      type: Number,
      default: 1,
    },
    capacity: {
      type: Number,
      default: 1,
    },
    special: String,
    relics: {
      type: Number,
      default: 0,
    },
    favor: Number,
    secrets: Number,
    resources: String,
    relicRecoverCost: String,
    back: {
      type: Boolean,
      default: false,
    }
  },
  computed: {
    cardImage() {
      return { backgroundImage: `url(${this.image})` };
    },
    relicFrame() {
      //return `/img/site ${this.relics} relics.png`;
      return `/img/site 0 relics.png`;
    },
    relicRecoverCosts() {
      return this.relicRecoverCost?.split('') || [];
    },
  }
}
</script>

<style scoped lang="scss">
.site {
  overflow: hidden;
  position: relative;
  float: left;
  display: block;
  page-break-inside: avoid;

  height: 89mm;
  width: 115mm;
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

.recoverables {
  position: absolute;
  top: 8mm;
  left: 7.5mm;
  height: 5mm;

}

.resource {
  margin-right: -2mm;
  &:last-child {
    margin-right: 0;
  }
}

.capacity {
  position: absolute;
  top: 9mm;
  right: 8.5mm;

  font-family: OathText, sans-serif;
  font-size: 8mm;
  font-weight: 600;
  color: black;
}

.name {
  position: absolute;
  bottom: 6mm;
  left: 0;
  padding-left: 26mm;

  color: black;
  font-size: 8mm;
  font-family: OathText, sans-serif;

  &:first-letter {
    font-family: OathCapital, serif;
    text-transform: capitalize;
  }
}

.cost {
  position: absolute;
  bottom: 5mm;
  right: 0;
  width: 100%;
  padding-right: 5mm;
  text-align: right;
  font-size: 5mm;
  text-shadow: 0 0 white;
  display: inline-block;

  & > * {
    vertical-align: middle;
  }

}
</style>
