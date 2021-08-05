import Vue from 'vue';
import VueGtag from 'vue-gtag';

export default ({ app }) => {
  Vue.use(VueGtag, {
    enabled: app.context.$config.gtag,
    config: { id: 'G-9RT30ZY41J' },
  })
}

