import Vue from 'vue';
import VueGtag from 'vue-gtag';

export default ({ app }) => {
  if (app.context.$config.gtag) {
    Vue.use(VueGtag, {
      enabled: app.context.$config.gtag,
      config: {
        id: 'G-9RT30ZY41J',
        params: {
          'anonymize_ip': true,
          'cookie_domain': 'oath-card-builder.herokuapp.com/',
          'cookie_flags': 'SameSite=None;Secure',
        }
      },
    });
  }
};

