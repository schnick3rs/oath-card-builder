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
        '!': 'favor-burned',
        's': 'secret',
        '2': 'secret',
        'S': 'secret-burned',
        '@': 'secret-burned',
        '+': 'die-attacker',
        '-': 'die-defender',
        '~': 'die-turn-order',
        'a': 'suit-arcane',
        'b': 'suit-beast',
        'c': 'suit-clockwork',
        'd': 'suit-discord',
        'h': 'suit-hearth',
        'n': 'suit-nomad',
        'o': 'suit-order',
        '$': 'die-defender-shield',
        '§': 'die-defender-double',
        '7': 'die-attacker-sword',
        '&': 'die-attacker-hallow',
        '*': 'die-attacker-hallow',
        '%': 'die-attacker-skull',
        '>': 'to-favor-bank',
      },
    };
  },
  computed: {
    src() {
      return `/img/icons/${this.map[this.symbol]}.png`;
    },
    styleSize() {
      return `height: ${this.symbol === '>' ? this.size-2 : this.size}px;`;
    },
  },
}
</script>

<style scoped lang="scss">
.oath-symbol {
}
</style>
