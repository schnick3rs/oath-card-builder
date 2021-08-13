<template>
  <div>
    <div class="denizen cutter">

      <div v-if="image" class="layer layer-image" :style="cardImage"></div>

      <img v-if="restriction" class="layer" :src="restrictionBand">
      <img v-if="suit" class="layer" :src="suitBand">
      <div v-if="name" class="name">
        <capital-text :text="name" :font-size="'4mm'"></capital-text>
      </div>

      <div class="layer effect" :class="`effect--${type}`">
        <img v-if="showModifer" class="layer layer--modifer" :src="modiferImage">
        <div class="content" :class="`content--${type}`">
          <symbol-text class="text" :html="formatedText"></symbol-text>
        </div>
      </div>

      <div v-if="cost" class="cost symbol">
        <oath-symbol
          v-for="(c, i) in costs"
          :key="i"
          :symbol="c"
          :size="20"
          border
        ></oath-symbol>
      </div>

      <em v-if="credits" class="credits">&copy; {{credits}}</em>

    </div>
    <denizen-card-back v-if="back"></denizen-card-back>
  </div>
</template>

<script>
import DOMPurify from 'isomorphic-dompurify';
import marked from "marked";

export default {
  name: "DenizenCard",
  props: {
    edifice: Boolean,
    name: String,
    suit: String,
    restriction: String,
    type: String,
    modifer: String,
    image: String,
    text: String,
    credits: String,
    cost: String,
    back: {
      type: Boolean,
      default: false,
    }
  },
  computed: {
    nameWords() {
      if (this.name) {
        return [...this.name.split(' ')];
      }
      return '';
    },
    showModifer() {
      return this.type.includes('modifer');
    },
    cardImage() {
      return { backgroundImage: `url(${this.image})` };
    },
    formatedText() {
      const renderer = { del(text) { return `~${text}~`; } };
      marked.use({ renderer });
      return this.text ? marked(DOMPurify.sanitize(this.text)) : '';
    },
    costs() {
      return this.cost?.split('') || [];
    },
    suitBand() {
      return `/img/${this.edifice ? 'ediface' : 'denizen'} ${this.suit}.png`;
    },
    restrictionBand() {
      return `/img/restriction ${this.restriction} ${this.suit}.png`;
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

  &--modifer {
    left: -0.7mm;
  }
}

.illustration {

}

.name {
  position: absolute;
  top: 8.5mm;
  left: 0;

  padding-left: 17mm;
  color: white;
}

.credits {
  position: absolute;
  left: 0;
  top: 1mm;
  width: 100%;
  text-align: center;
  font-size: 2.5mm;
  display: flex;
  align-items: center;
  justify-content: center;
  color: black;
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
  height: 23mm;
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
  bottom: 18mm;
  width: 100%;
  text-align: center;
  text-shadow: 0 0 white;
}
</style>
