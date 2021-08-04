<template>

  <v-row>

    <v-col>
      <v-btn to="/builder" color="primary">
        To the Card Builder
      </v-btn>
    </v-col>

    <v-col cols="12">
      <p>Shows all your created denizen.</p>
    </v-col>

    <client-only>
      <v-col cols="12">
        <v-data-table
          :headers="table.headers"
          :items="library"
          class="elevation-1"
        >

          <template v-slot:item.suit="{ item }">
            <v-avatar :size="24">
              <img :alt="item.suit" :src="`/img/icons/suit-${item.suit}.png`" />
            </v-avatar>
          </template>

          <template v-slot:item.cost="{ item }">
            <div
              v-if="item.cost"
              style="display: flex; align-content: center; flex-direction: row; justify-content: center; align-items: center;"
            >
              <oath-symbol v-for="(c, i) in item.cost" :key="i" :symbol="c" :size="16" />
            </div>
          </template>

          <template v-slot:item.text="{ item }">
            <symbol-text :html="formatText(item.text)"></symbol-text>
          </template>
        </v-data-table>
      </v-col>
    </client-only>

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
      },
      data: undefined,
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
