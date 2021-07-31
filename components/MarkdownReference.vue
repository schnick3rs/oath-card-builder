<template>
  <div>
    <p>You markdown syntax</p>
    <ul>
      <li v-for="s in syntax">
        <code>{{s}}</code> => <span v-html="parse(s)"></span>
      </li>
    </ul>
  </div>
</template>

<script>
import marked from "marked";

export default {
  name: "MarkdownReference",
  data() {
    return {
      syntax: [
        '*Action:*',
        '_italic_',
      ],
    };
  },
  methods: {
    parse(text) {
      return marked.parseInline(text);
    }
  }
}
</script>

<style scoped>

</style>
