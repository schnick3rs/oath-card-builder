<template>
  <div>
    <div class="relic cutter" :style="dimensionStyle">
      <div class="layer illustration"></div>

      <div v-show="true" class="layer layer--image" :style="cardImage"></div>
      <img v-show="false" class="layer" :src="image">

      <em v-if="credits" class="credits">&copy; {{credits}}</em>

      <img class="layer layer--defense" :src="defenseImage">

      <div v-if="name" class="name" :style="nameStyle">
        <capital-text :text="name"></capital-text>
      </div>

      <div class="layer effect" :class="`effect--${type}`">
        <img v-if="modifer" class="layer layer--modifer" :src="modiferImage">
        <div class="content" :style="contentStyle">
          <symbol-text class="text" :html="formatedText" :factor="factor"></symbol-text>
        </div>
      </div>

      <div v-if="cost" class="cost symbol" :style="costStyle">
        <oath-symbol
          v-for="(c, i) in costs"
          :key="i"
          :symbol="c"
          :size="costSymbolSize"
          border
        ></oath-symbol>
      </div>

    </div>
    <div class="relic cutter" v-if="back">
      <div class="layer back"></div>
    </div>
  </div>
</template>

<script>
import DOMPurify from 'isomorphic-dompurify';
import marked from 'marked';
import { nanoid } from 'nanoid';

export default {
  name: "RelicCard",
  props: {
    factor: {
      type: Number,
      default: 1,
    },
    id: {
      type: String,
      default: () => nanoid(12),
    },
    name: String,
    image: String,
    credits: String,
    defense: Number,
    type: String,
    modifer: String,
    text: String,
    cost: String,
    back: Boolean,
    showCutter: Boolean,
    showBlend: Boolean,
    enableSharing: Boolean,
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
      const renderer = { del(text) { return `~${text}~`; } };
      marked.use({ renderer });
      return this.text ? marked(DOMPurify.sanitize(this.text)) : '';
    },
    costs() {
      return this.cost?.split('') || [];
    },
    costSymbolSize() {
      return 18*this.factor;
    },
    dimensionStyle() {
      return {
        height: `${57*this.factor}mm`,
        width: `${57*this.factor}mm`,
      };
    },
    nameStyle(){
      return {
        'top': `${4*this.factor}mm`,
        'left': `${4*this.factor}mm`,
        'font-size': `${4.5*this.factor}mm`,
        'letter-spacing': `-${0.2*this.factor}mm`,
      };
    },
    costStyle() {
      return {
        bottom: `${12*this.factor}mm`,
      };
    },
    contentStyle() {

      let fontFactor = 1;
      fontFactor = this.text.length > 100 ? 0.9 : fontFactor;
      fontFactor = this.text.length > 200 ? 0.8 : fontFactor;
      fontFactor = this.text.length > 250 ? 0.7 : fontFactor;
      fontFactor = this.text.length > 300 ? 0.6 : fontFactor;

      return {
        'height': `${14*this.factor}mm`,
        'font-size': `${3.0*this.factor*fontFactor}mm`,
        'line-height': `${3.5*this.factor*fontFactor}mm`,
        'letter-spacing': '-0.5px',
        'padding': `${1*this.factor}mm ${2*this.factor}mm`,
      };
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
  top: 4mm;
  left: 4mm;
  width: 100%;
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

.credits {
  position: absolute;
  right: -25mm;
  top: 8mm;
  width: 100%;
  transform: rotate(-90deg);
  font-size: 2.5mm;
  color: white;
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
    /*height: 41mm;*/
    height: 44mm;
  }

  &--modifer {

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
  bottom: 11.8mm;
  width: 100%;
  text-align: center;
}

.symbol {
  font-family: OathSymbols;
  color: red;
}

</style>
