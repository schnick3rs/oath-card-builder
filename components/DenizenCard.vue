<template>
  <div>
    <div class="denizen cutter">

      <div class="layer layer-image" :style="cardImage"></div>

      <img v-if="restrictionBand" class="layer" :src="restrictionBand">
      <img class="layer" :src="suitBand">
      <span class="name">{{name}}</span>

      <div class="layer effect" :class="`effect--${type}`">
        <img v-if="modifer" class="layer" :src="modiferImage">
        <div class="content" :class="`content--${type}`">
          <symbol-text class="text" :html="formatedText"></symbol-text>
        </div>
      </div>

      <div v-if="cost" class="cost symbol">
        <oath-symbol :symbol="c" v-for="c in costs" :size="18"></oath-symbol>
      </div>

    </div>
    <div class="denizen cutter" v-if="false">
      <div class="layer back"></div>
    </div>
  </div>
</template>

<script>
import marked from "marked";

export default {
  name: "DenizenCard",
  props: {
    name: String,
    suit: String,
    restriction: String,
    type: String,
    modifer: String,
    image: String,
    text: String,
    cost: String,
  },
  computed: {
    cardImage() {
      return {
        backgroundImage: `url(${this.image})`,
      };
    },
    formatedText() {
      return marked(this.text);
    },
    costs() {
      return this.cost?.split('') || [];
    },
    suitBand() {
      return `/img/denizen ${this.suit}.png`;
    },
    restrictionBand() {
      return `/img/restriction ${this.restriction}.png`;
    },
    modiferImage() {
      return `/img/action modifer ${this.modifer}.png`;
    },
  }
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

.illustration {

}

.back {
  background-image: url('/img/denizen card back.png');
}

.name {
  position: absolute;
  top: 8.5mm;
  left: 0;
  /* font-family: OathCapital, Serif; */
  font-family: OathText, sans-serif;
  color: white;
  padding-left: 17mm;
}

.name::first-letter {
  font-family: OathCapital, Serif;
}

.effect {

  &--power { background-image: url('/img/box minor action.png'); }
  &--power-modifer { background-image: url('/img/box action modifier.png'); }

  &--persistent { background-image: url('/img/box persistent.png'); }
  &--persistent-modifer { background-image: url('/img/box persistent action modifer.png'); }

  &--battleplan-attacker { background-image: url('/img/box battle plan attacker.png'); }
  &--battleplan-defender { background-image: url('/img/box battle plan defender.png'); }
  &--battleplan-both { background-image: url('/img/box battle plan both.png'); }

  &--instant-large { background-image: url('/img/box when played large.png'); }
  &--instant-medium { background-image: url('/img/box when played medium.png'); }
  &--instant-small { background-image: url('/img/box when played small.png'); }

}

.content {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 22mm;
  text-align: center;
  font-size: 3.8mm;
  line-height: 3.5mm;
  letter-spacing: -0.5px;
  padding: 2mm 2.5mm;
  /* vertical-align: middle; */
  display: flex;
  align-items: center;
  justify-content: center;

  &--instant-small {
    height: 26mm;
    text-align: center;
    padding: 9mm 8.5mm;
  }

  &--instant-medium {
    height: 32.5mm;
    text-align: center;
    padding: 9mm 8.5mm;
  }

  &--instant-large {
    height: 39mm;
    text-align: center;
    padding: 9mm 8.5mm;
  }

}

.text {
  font-family: OathText, sans-serif;
  color: black;
}

.cost {
  position: absolute;
  bottom: 19mm;
  width: 100%;
  text-align: center;
  font-size: 5mm;
  text-shadow: 0 0 white;
}

.symbol {
  font-family: OathSymbols;
  color: red;
}

</style>
