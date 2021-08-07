<template>
  <div>

    <div class="site cutter">

      <div v-if="image" class="layer layer-image" :style="cardImage"></div>

      <img class="layer" :src="relicFrame"/>

      <div v-if="text" class="special-text">
        <symbol-text class="text" :html="formatedText"></symbol-text>
      </div>

      <div class="recoverables">
        <div class="resources">
          <template v-for="(n, i) in resources">
            <oath-symbol :key="i" :symbol="n" :size="17" class="resource" />
          </template>
        </div>
        <img
          v-if="relics > 0"
          v-for="(n, i) in relics"
          :key="i"
          src="/img/icons/relic.png"
          style="height: 5mm; margin-right: 1mm;"
        >
      </div>

      <span class="capacity">{{capacity}}</span>

      <div v-if="name" class="name">
        <div
          class="name__word"
          v-for="(word, i) in name.split(' ')"
          :key="i"
        >
          {{word}}&nbsp;
        </div>
      </div>

      <div v-if="relicRecoverCost" class="recover-cost">
        <img src="/img/icons/relic-recover.png" style="height: 24px;">
        <div class="costs">
          <template v-for="(n, i) in relicRecoverCosts.costs" >
            <oath-symbol :key="i" :symbol="n" :size="17" class="resource" />
          </template>
        </div>
        <template v-if="relicRecoverCosts.suit">
          <oath-symbol symbol=">" :size="14"/>
          <oath-symbol :symbol="relicRecoverCosts.suit" :size="20"/>
        </template>
      </div>

    </div>

    <site-card-back v-if="back"></site-card-back>
  </div>
</template>

<script>
import marked from "marked";
import DOMPurify from "isomorphic-dompurify";

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
    text: String,
    relics: {
      type: Number,
      default: 0,
    },
    resources: String,
    relicRecoverCost: {
      type: String,
      default: '',
    },
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
      let split = this.relicRecoverCost.split('>');
      if (split.length === 2) {
        return {
          costs: split[0].split('') || [],
          suit: split[1],
        };
      } else {
        return {
          costs: split[0].split('') || [],
          suit: null,
        };
      }
    },
    formatedText() {
      const renderer = { del(text) { return `~${text}~`; } };
      marked.use({ renderer });
      return this.text ? marked(DOMPurify.sanitize(this.text)) : '';
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

.special-text {
  position: absolute;
  top: 20mm;
  left: 10mm;
  width: 50mm;
  background: white;
  padding: 5mm;
  margin: 5mm;
  border: black dashed 0.5mm;
  border-radius: 2mm;
}

.recoverables {
  position: absolute;
  top: 8mm;
  left: 7.5mm;
  height: 5mm;

}

.resources {
  display: inline-block;
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
  bottom: 4mm;
  left: 0;
  padding-left: 26mm;

  display: inline-block;
  color: black;

  &__word {
    font-size: 8mm;
    font-family: OathText, sans-serif;
    display: inline-block;

    &:first-letter {
      font-family: OathCapital, serif;
      text-transform: capitalize;
    }
  }
}

.recover-cost {
  position: absolute;
  bottom: 5mm;
  right: 0;
  width: 100%;
  padding-right: 5mm;
  text-align: right;
  font-size: 5mm;
  text-shadow: 0 0 white;
  display: inline-block;
  vertical-align: middle;
  height: 24px;

  & > * {
    vertical-align: middle;
  }

}

.costs {
  display: inline-block;
  vertical-align: middle;
}
</style>
