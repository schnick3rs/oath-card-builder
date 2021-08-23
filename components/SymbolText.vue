<script>
export default {
  name: "SymbolText",
  props: {
    html: String,
    factor: {
      type: Number,
      default: 1,
    },
  },
  computed: {
    bigDieFontSize() {
      return {
        'font-size': `${7.5*this.factor}mm`,
      }
    },
  },
  methods: {
    parseHtml(html) {
      let finalHtml = this.parseForShortcodes(html);
      return finalHtml;
    },
    parseForShortcodes(html) {
      let finalHtml = html;
      const symbolSize = 12*this.factor;
      const bigDieFontSize = `font-size: ${7.5*this.factor}mm`;
      const bigDieFactorClass = `big-die-${this.factor}`;

      finalHtml = finalHtml.replace(/{(.)}/mg,
        `<oath-symbol style="position: relative; top: 0.5mm;" symbol="$1" :size="${symbolSize}"></oath-symbol>`);

      finalHtml = finalHtml.replace(/<strong>When played,<\/strong>/mg,
        `<strong class="uppercase"><span class="capital">W</span>hen&nbsp;played,</strong>`);

      finalHtml = finalHtml.replace(/<strong>(.)(.+:)<\/strong>/mg,
        `<strong class="uppercase"><span class="capital">$1</span>$2</strong>`);

      finalHtml = finalHtml.replace(/\[(.*)\](.*)<\/p>/mg,
        `<span class="big-die ${bigDieFactorClass}" style="${bigDieFontSize}">$1</span><span class="normal-text">$2</span></p>`);

      return finalHtml;
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

<style lang="scss">
.markdown-html-text {
  & > p {
    margin-bottom: 1mm;
  }

  & > p:last-child {
    margin-bottom: 0;
  }

  & .uppercase {
    font-variant: small-caps;
  }

  & > blockquote {

    display: flex;
    flex-direction: row;
    align-items: center;
    //margin-top: 1mm;

    & > p {

      display: flex;
      flex-direction: row;
      align-items: center;
      margin-bottom: 0;

      & > .big-die {
        font-size: 7.5mm;
        display: contents;
        /* vertical-align: middle; */
        &.big-die-1 > img { height:  6mm !important; }
        &.big-die-2 > img { height: 12mm !important; }
        &.big-die-3 > img { height: 18mm !important; }
        &.big-die-4 > img { height: 24mm !important; }
        &.big-die-5 > img { height: 30mm !important; }
      }

      & > .normal-text {
        text-align: left;
        padding-left: 2mm;
      }
    }

  }
}


</style>
