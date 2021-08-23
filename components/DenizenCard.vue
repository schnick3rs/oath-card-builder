<template>
  <div>
    <div v-if="enableSharing">
      <v-dialog
        v-model="loading"
        persistent
        width="300"
      >
        <v-card
          color="primary"
          dark
        >
          <v-card-text>
            Generating image for sharing...
            <v-progress-linear
              indeterminate
              color="white"
              class="mb-0"
            ></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-menu
        v-model="showMenu"
        :position-x="x"
        :position-y="y"
        absolute
        offset-y
      >
        <v-list dense>
          <v-list-item @click="copyToClipboard"><v-list-item-title>copy to clipboard</v-list-item-title></v-list-item>
          <v-list-item @click="downloadPng"><v-list-item-title>download png</v-list-item-title></v-list-item>
          <v-list-item v-show="false" :disabled="!enableFlipping" @click="flipped = !flipped"><v-list-item-title>flip card</v-list-item-title></v-list-item>
        </v-list>
      </v-menu>
    </div>
    <denizen-card-back v-if="flipped"></denizen-card-back>
    <div
      v-else
      class="denizen"
      :class="{ 'cutter': showCutter }"
      :style="denizenDimension"
      :id="canvasId"
      @contextmenu.prevent="show"
    >

      <div v-if="image" class="layer layer-image" :style="cardImage"></div>

      <img v-if="restriction" class="layer" :src="restrictionBand">
      <img v-if="suit" class="layer" :src="suitBand">
      <div v-if="name" class="name" :style="nameStyle">
        <capital-text :text="name"></capital-text>
      </div>

      <div class="layer effect" :class="`effect--${type}`">
        <img v-if="showModifer" class="layer layer--modifer" :src="modiferImage">
        <div class="content" :class="`content--${type}`" :style="contentStyle">
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

      <em v-if="credits" class="credits">&copy; {{credits}}</em>

    </div>
    <denizen-card-back v-if="back" ></denizen-card-back>
  </div>
</template>

<script>
import DOMPurify from 'isomorphic-dompurify';
import marked from "marked";
import domtoimage from 'dom-to-image';
import { saveAs } from 'file-saver';

export default {
  name: "DenizenCard",
  props: {
    factor: {
      type: Number,
      default: 1,
    },
    id: {
      type: String,
      default: 'random',
    },
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
    back: Boolean,
    showCutter: Boolean,
    enableSharing: Boolean,
    enableFlipping: Boolean,
  },
  data() {
    return {
      showMenu: false,
      x: 0,
      y: 0,
      loading: false,
      flipped: false,
    }
  },
  computed: {
    canvasId() {
      return `${this.id}`;
    },
    imageProxy() {
      if (this.image) {
        return `/api/image/?url=${this.image}`;
      }
      return null;
    },
    nameWords() {
      if (this.name) {
        return [...this.name.split(' ')];
      }
      return '';
    },
    costSymbolSize() {
      return 20*this.factor;
    },
    denizenDimension() {
      return {
        height: `${89*this.factor}mm`,
        width: `${57*this.factor}mm`,
      };
    },
    nameStyle(){
      return {
        'top': `${7.5*this.factor}mm`,
        'height': `${7*this.factor}mm`,
        'padding-left': `${16*this.factor}mm`,
        'font-size': `${4.5*this.factor}mm`,
        'letter-spacing': `-${0.2*this.factor}mm`,
      };
    },
    costStyle() {
      return {
        bottom: `${19*this.factor}mm`,
      };
    },
    contentStyle() {

      let tweak = {};
      switch (this.type) {

        case 'instant-small':
          tweak = {
            'height': `${26*this.factor}mm`,
            'padding': `${9*this.factor}mm ${8.5*this.factor}mm`,
          };
          break;

        case 'instant-medium':
          tweak = {
            'height': `${32.5*this.factor}mm`,
            'padding': `${8.5*this.factor}mm ${8*this.factor}mm`,
          };
          break;

        case 'instant-large':
          tweak = {
            'height': `${39*this.factor}mm`,
            'padding': `${8.2*this.factor}mm ${8*this.factor}mm`,
          };
          break;
      }

      let fontFactor = 1;
      fontFactor = this.text.length > 100 ? 0.9 : fontFactor;
      fontFactor = this.text.length > 200 ? 0.8 : fontFactor;
      fontFactor = this.text.length > 250 ? 0.7 : fontFactor;
      fontFactor = this.text.length > 300 ? 0.6 : fontFactor;

      return {
        'height': `${23*this.factor}mm`,
        'font-size': `${3.8*this.factor*fontFactor}mm`,
        'line-height': `${3.3*this.factor*fontFactor}mm`,
        'letter-spacing': '-0.5px',
        'padding': `${2*this.factor}mm ${2.5*this.factor}mm`,
        ...tweak,
      };
    },
    showModifer() {
      return this.type.includes('modifer');
    },
    cardImage() {
      return { backgroundImage: `url(${this.imageProxy})` };
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
  },
  methods: {
    show(e) {
      if (this.enableSharing) {
        this.showMenu = false
        this.x = e.clientX
        this.y = e.clientY
        this.$nextTick(() => {
          this.showMenu = true
        })
      }
    },
    copyToClipboard(event) {
      const node = document.getElementById(this.canvasId);
      const a = this;

      this.loading = true;
      this.cutter = false;

      domtoimage.toBlob(node)
        .then(function (blob) {
          navigator.clipboard.write([
            new ClipboardItem({
              [blob.type]: blob
            })
          ]);
          a.cutter = true;
          a.loading = false;
        })
        .catch(function (error) {
          console.error('oops, something went wrong!', error);
        });
    },
    downloadPng(event) {
      const node = document.getElementById(this.canvasId);
      const a = this;

      this.loading = true;
      this.cutter = false;

      domtoimage.toBlob(node)
        .then(function (blob) {
          saveAs(blob, `oath-${a.edifice ? 'edifice' : 'denizen'}-${a.name.toLowerCase()}.png`);
          a.cutter = true;
          a.loading = false;
        })
        .catch(function (error) {
          console.error('oops, something went wrong!', error);
        });
    }
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

  height: 89mm; // dynamic
  width: 57mm; // dynamic
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
  top: 8.5mm; // dynamic
  left: 0;
  padding-left: 17mm; // dynamic

  justify-content: center;
  align-items: center;
  display: flex;

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
  /*line-height: 3.5mm;*/
  line-height: 3.3mm;
  letter-spacing: -0.5px;
  padding: 2mm 2.5mm;
  /* vertical-align: middle; */
  display: flex;
  align-items: center;
  justify-content: center;

  &--instant-small {
    height: 26mm;
    padding: 9mm 8.5mm;
  }

  &--instant-medium {
    height: 32.5mm;
    padding: 8.5mm 8mm;
  }

  &--instant-large {
    height: 39mm;
    padding: 8.2mm 8mm;
  }

}

.text {
  font-family: OathText, sans-serif;
  color: black;
}

.cost {
  position: absolute;
  bottom: 18mm; // dynamic
  width: 100%;
  text-align: center;
  text-shadow: 0 0 white;
}
</style>
