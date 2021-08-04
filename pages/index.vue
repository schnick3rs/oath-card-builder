<template>
  <v-row>
    <v-col>
      <v-data-table
        :headers="table.headers"
        :items="library"
      >
        <template v-slot:item.suit="{ item }">
          <v-avatar :size="24"><img :src="`/img/icons/suit-${item.suit}.png`"></v-avatar>
        </template>
        <template v-slot:item.cost="{ item }">
          <div style="display: flex; align-content: center; flex-direction: row; justify-content: center; align-items: center;">
            <oath-symbol v-for="c in item.cost" :symbol="c" :size="16" />
          </div>
        </template>
        <template v-slot:item.text="{ item }">
          <symbol-text :html="formatText(item.text)"></symbol-text>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import marked from "marked";
import DOMPurify from "isomorphic-dompurify";

export default {
  name: 'index',
  data() {
    return {
      table: {
        headers: [
          { text: 'Type', value: '__type' },
          { text: 'Suit', value: 'suit' },
          { text: 'Name', value: 'name' },
          { text: 'Cost', value: 'cost' },
          { text: 'Text', value: 'text' },
        ]
      }
    };
  },
  computed: {
    library() {
      return this.$store.getters['library/cardSets'];
    },
  },
  methods: {
    formatText(text) {
      const renderer = { del(text) { return `~${text}~`; } };
      marked.use({ renderer });
      return text ? marked.parseInline(DOMPurify.sanitize(text)) : '';
    },
  }
}
</script>

<style scoped>

</style>
