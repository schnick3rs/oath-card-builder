<template>
  <img :src="src" :style="styleSize" class="oath-symbol">
</template>

<script>
export default {
  name: "OathSymbol",
  props: {
    symbol: String,
    size: {
      type: Number,
      default: 12,
    },
  },
  data() {
    return {
      map: {
        'f': 'favor',
        '1': 'favor',
        'F': 'favor-burned',
        '!': 'favor',
        's': 'secret',
        '2': 'secret',
        'S': 'secret-burned',
        '@': 'secret-burned',
        '+': 'secret-burned',
        '-': 'secret-burned',
        'a': 'suit-arcane',
        'b': 'suit-beast',
        'd': 'suit-discord',
        'h': 'suit-hearth',
        'n': 'suit-nomad',
        'o': 'suit-order',
        '$': 'shield',
        '7': 'sword',
        '&': 'sword-hallow',
        '%': 'sword-skull',
      },
    };
  },
  computed: {
    src() {
      return `/img/icons/${this.map[this.symbol]}.png`;
    },
    styleSize() {
      return `height: ${this.size}px;`;
    },
  },
}
</script>

<style scoped lang="scss">
.oath-symbol {
}
</style>
