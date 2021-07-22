<template>
  <div>
    <div class="relic cutter">
      <div class="layer illustration"></div>

      <div v-show="true" class="layer layer--image" :style="cardImage"></div>
      <img v-show="false" class="layer" :src="image">

      <img class="layer layer--defense" :src="defenseImage">

      <span class="name">{{name}}</span>

      <div class="layer effect" :class="`effect--${type}`">
        <img v-if="modifer" class="layer" :src="modiferImage">
        <div class="content">
          <div class="text" v-html="formatedText"></div>
        </div>
      </div>

      <span v-if="cost" class="cost symbol">{{cost}}</span>

    </div>
    <div class="relic cutter">
      <div class="layer back"></div>
    </div>
  </div>
</template>

<script>
import marked from 'marked';

export default {
  name: "RelicCard",
  props: {
    name: String,
    image: String,
    defense: Number,
    type: String,
    modifer: String,
    text: String,
    cost: String,
  },
  computed: {
    cardImage() {
      return {
        backgroundImage: `url(${this.image})`,
      };
    },
    defenseImage() {
      return `/img/relic defense ${this.defense}.png`;
    },
    formatedText() {
      return marked(this.text);
    },
    modiferImage() {
      return `/img/relic action modifer ${this.modifer}.png`;
    },
  },
}
</script>

<style scoped lang="scss">

.relic {
  overflow: hidden;
  position: relative;
  float: left;
  display: block;
  page-break-inside: avoid;

  height: 57mm;
  width: 57mm;
}

.illustration {
  background-image: url('/img/relic illustration background.png');
}

.back {
  background-image: url('/img/relic card back.png');
}

.name {
  position: absolute;
  top: 6mm;
  left: 5mm;
  width: 100%;
  font-family: OathCapital, Serif;
  color: white;
}

.defense {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
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

  &--image {
    height: 41mm;
  }
}

.effect {

  &--power { background-image: url('/img/relic box minor action.png'); }
  &--power-modifer { background-image: url('/img/relic box action modifer.png'); }

  &--persistent { background-image: url('/img/relic box persistent.png'); }
  &--persistent-modifer { background-image: url('/img/relic box persistent action modifer.png'); }

  &--battleplan-attacker { background-image: url('/img/relic box battle plan attacker.png'); }
  &--battleplan-defender { background-image: url('/img/relic box battle plan defender.png'); }
  &--battleplan-both { background-image: url('/img/relic box battle plan both.png'); }

}

.content {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 14mm;

  text-align: center;
  font-size: 3.0mm;
  line-height: 3.5mm;
  letter-spacing: -0.5px;
  padding: 1mm 2mm;
}

.text {
  font-family: OathText, sans-serif;
  color: black;
}

.cost {
  position: absolute;
  bottom: 13mm;
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
