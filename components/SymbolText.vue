<script>
export default {
  name: "SymbolText",
  props: {
    html: String,
  },
  methods: {
    parseHtml(html) {
      let finalHtml = this.parseForShortcodes(html);
      return finalHtml;
    },
    parseForShortcodes(html) {
      return html.replace(/{(.)}/mg, `<oath-symbol style="position: relative; top: 0.5mm;" symbol="$1"></oath-symbol>`);
    },
  },
  render(h) {
    const template = this.parseHtml(this.html);
    return h({
      template: `<div class="markdown-html-text">${template}</div>`,
    });
  },
}
</script>

<style scoped>

</style>
