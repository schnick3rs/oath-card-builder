<template>
  <div>
    <p>You can use these brackets <code>{*}</code> to write OATH symbols. Where <code>*</code> needs to match one of the characters below.</p>
    <ul>
      <li v-for="(s, i) in Object.keys(symbols)" :key="i">
        <code>{{s}}</code> => <oath-symbol :symbol="s"></oath-symbol>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "OathSymbolReference",
  data() {
    return {
      symbols: {
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
        '~': 'die-turn-order', // del deleted in marked renderer
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
        '8': 'die-attacker-hallow',
        '%': 'die-attacker-skull',
        '>': 'to-favor-bank',
        '=': 'to-favor-bank',
      },
    };
  },
}
</script>

<style scoped>

</style>
