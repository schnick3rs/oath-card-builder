<template>
  <v-app>
    <v-app-bar
      app
      dark
      dense
      fixed
      :clipped-left="clipped"
    >
      <v-container
        class="pa-0 fill-height"
        :class="{ 'pl-2 pr-2': this.$vuetify.breakpoint.mdAndUp }"
      >
        <v-toolbar-title>
          <nuxt-link to="/" class="title" style="color: hsl(0, 0%, 100%); text-decoration: none;">
            {{title}}
          </nuxt-link>
        </v-toolbar-title>

        <v-spacer />

        <v-toolbar-items>
          <v-btn
            icon
            href="https://github.com/schnick3rs/oath-card-builder"
            target="_blank"
            title="Code Repository on GitHub"
          >
            <v-icon>mdi-git</v-icon>
          </v-btn>
          <v-btn icon to="/about">
            <v-icon color=" info">mdi-help-circle</v-icon>
          </v-btn>

          <v-app-bar-nav-icon
            v-if="false"
            @click.stop="drawer = !drawer"
          ></v-app-bar-nav-icon>

        </v-toolbar-items>

      </v-container>

    </v-app-bar>


    <v-navigation-drawer
      v-model="drawer"
      absolute
      bottom
      right
      temporary
    >
      <v-list
        nav
        dense
      >
        <v-list-item>somes</v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>

    <v-footer
      :absolute="!fixed"
      app
      class="caption"
    >
      <span><a href="https://ledergames.com/products/oath-chronicles-of-empire-exile">Oath</a> from <a href="https://ledergames.com/">Leder Games</a></span>
      <span>&nbsp;•&nbsp;</span>
      <span><a href="https://github.com/schnick3rs/oath-card-builder">Code</a> by schnick3rs</span>
      <span>&nbsp;•&nbsp;</span>
      <span>Support me on <a href="https://ko-fi.com/schnickers">ko.fi</a>.</span>
      <v-spacer></v-spacer>
      <span>&copy; {{ new Date().getFullYear() }}</span>
      <span>&nbsp;•&nbsp;</span>
      <nuxt-link to="/about">About</nuxt-link>
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
