export default {
  methods: {
    seo(title, description, image)  {
      let meta = [
        { hid: 'og:title', name: 'og:title', content: title },
        { hid: 'twitter:card', name: 'twitter:card', content: 'summary_large_image' },
        { hid: 'twitter:title', name: 'twitter:title', content: title },
      ];
      if (description) {
        meta.push({ hid: 'description', name: 'description', content: description });
        meta.push({ hid: 'og:description', name: 'og:description', content: description });
        meta.push({ hid: 'twitter:description', name: 'twitter:description', content: description });
      }
      if (image) {
        meta.push({ hid: 'og:image', name: 'og:image', content: image });
        meta.push({ hid: 'twitter:image', name: 'twitter:image', content: image });
      }
      return {
        title,
        meta,
      };
    },
  }
}
