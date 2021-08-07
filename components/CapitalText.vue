<template>
  <div :style="style">
    <span class="word" v-for="(word, index) in words" :key="index">{{word}}&nbsp;</span>
  </div>
</template>

<script>
export default {
  name: 'CapitalText',
  props: {
    text: String,
    fontSize: String,
  },
  data() {
    return {
      componentKey: 1,
    };
  },
  computed: {
    words() {
      return this.text.split(' ');
    },
    style() {
      return `font-size: ${this.fontSize}`;
    }
  },
}
</script>

<style scoped lang="scss">
.word {
  font-family: OathText, sans-serif;

  display: inline-block;

  &:first-letter {
    font-family: OathCapital, serif;
    text-transform: capitalize;
  }
}
</style>
