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
      let finalHtml = html;

      finalHtml = finalHtml.replace(/{(.)}/mg,
        `<oath-symbol style="position: relative; top: 0.5mm;" symbol="$1"></oath-symbol>`);

      finalHtml = finalHtml.replace(/<strong>When played,<\/strong>/mg,
        `<strong class="uppercase"><span class="capital">W</span>hen&nbsp;played,</strong>`);

      finalHtml = finalHtml.replace(/<strong>(.)(.+:)<\/strong>/mg,
        `<strong class="uppercase"><span class="capital">$1</span>$2</strong>`);

      finalHtml = finalHtml.replace(/\[(.*)\](.*)<\/p>/mg,
        `<span class="big-die">$1</span><span class="normal-text">$2</span></p>`);

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
    /* text-transform: uppercase; */
    //font-size: 3.0mm;
    font-variant: small-caps;

    & .capital {
      //font-size: 3.4mm;
    }

  }

  & > blockquote {
    font-size: 7.5mm;
    display: flex;
    flex-direction: row;
    align-items: center;
    //margin-top: 1mm;

    & > p {

      font-size: 6.6mm;
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-bottom: 0;

      & > .big-die {
        display: contents;
        /* vertical-align: middle; */
        & > img {
          height: 6mm !important;
        }
      }

      & > .normal-text {
        font-size: 3.8mm;
        text-align: left;
        padding-left: 2mm;
      }
    }

  }
}


</style>
