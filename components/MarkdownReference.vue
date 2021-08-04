<template>
  <div>
    <p>You markdown syntax</p>
    <ul>
      <li>
        <code>**Action:**</code> =>
        <strong class="capitalcase"><span>A</span>ction:</strong>
        <em style="font-size: smaller">(A bold string endede with <code>:</code>)</em>
      </li>
      <li>
        <code>**When played,**</code> =>
        <strong class="capitalcase"><span>W</span>hen played,</strong>
        <em style="font-size: smaller">(The bold string: <code>When played,</code>)</em>
      </li>
      <li>
        <code>&gt; [+2{+}] when attacking</code> =>
        <em style="font-size: smaller">
          Use <code>&gt;</code> do e.g. promote battle dice within <code>[]</code>
        </em>
      </li>
      <li v-for="(s, i) in syntax" :key="i" >
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
        '**bold**',
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

<style scoped lang="scss">
.capitalcase {
  text-transform: uppercase;
  font-size: smaller;

  & > span {
    font-size: larger;
  }
}

</style>
