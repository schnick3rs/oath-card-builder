<template>
  <v-app>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
    >

      <v-btn icon to="/">
        <v-icon>mdi-home</v-icon>
      </v-btn>

      <v-toolbar-title v-text="title" />

      <v-btn icon to="/builder/demo">
        <v-icon>mdi-file-image</v-icon>
      </v-btn>

      <v-btn icon to="/print/deck">
        <v-icon color="primary">mdi-printer</v-icon>
      </v-btn>

      <v-btn icon to="/print/csv">
        <v-icon>mdi-file-upload</v-icon>
      </v-btn>

      <v-spacer />

      <v-btn icon href="https://github.com/schnick3rs/oath-card-builder" target="_blank">
        <v-icon>mdi-git</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon color="info">mdi-help-circle</v-icon>
      </v-btn>

    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer
      :absolute="!fixed"
      app
    >
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Oath Card Builder'
    }
  }
}
</script>
