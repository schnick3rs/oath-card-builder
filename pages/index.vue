<template>

  <v-row>

    <v-col>
      <v-toolbar dense>
        <v-toolbar-items>
          <v-btn color="primary" @click="createAndOpenEditor(lastType)">
            Create {{ lastType }}
          </v-btn>
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                dark
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="item in toolbar.create"
                :key="item.value"
                @click="createAndOpenEditor(item.value)"
              >
                {{ item.text }}
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar-items>
        <v-toolbar-items class="ml-2">
          <v-btn to="/print/deck">
            <v-icon left>mdi-printer</v-icon>
            Print Cards
          </v-btn>
          <v-btn to="/print/tts">
            <v-icon left>mdi-printer</v-icon>
            TTS Export
          </v-btn>

          <v-btn to="/print/csv">
            <v-icon left>mdi-file-upload</v-icon>
            Upload Csv
          </v-btn>

          <v-btn to="/builder/demo" exact>
            <v-icon left>mdi-file-image</v-icon>
            Demo Page
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
    </v-col>

    <client-only>
      <v-col cols="12">
        <v-data-table
          class="elevation-1"
          :search="search"
          :headers="table.headers"
          :items="library"
          :items-per-page="25"
          multi-sort
        >
          <template v-slot:top>
            <v-text-field
              v-model="search"
              label="Search"
              class="mx-4"
              append-icon="mdi-magnify"
            ></v-text-field>
          </template>

          <template v-slot:item.suit="{ item }">
            <v-avatar :size="24">
              <img v-if="item.__type === 'edifice'" :alt="item.front.suit" :src="`/img/icons/suit-${item.front.suit}.png`" />
              <img v-else :alt="item.suit" :src="`/img/icons/suit-${item.suit}.png`" />
            </v-avatar>
          </template>

          <template v-slot:item.restriction="{ item }">
            <v-avatar :size="30" tile>
              <img v-if="item.__type === 'edifice'" :alt="item.front.restriction" :src="`/img/icons/restriction ${item.front.restriction}.png`" />
              <img v-else :alt="item.suit" :src="`/img/icons/restriction ${item.restriction}.png`" />
            </v-avatar>
          </template>

          <template v-slot:item.name="{ item }">
            <div v-if="item.__type === 'edifice'">
              <div>{{item.front.name}}</div>
              <hr>
              <div>{{item.ruined.name}}</div>
            </div>
            <span v-else>{{item.name}}</span>
          </template>

          <template v-slot:item.type="{ item }">
            <v-avatar :size="24" tile>
              <img v-if="item.__type === 'edifice' && item.front.type" :alt="item.front.type" :src="`/img/icons/type-${item.front.type}.png`" />
              <img v-else :alt="item.type && item.type" :src="`/img/icons/type-${item.type}.png`" />
            </v-avatar>
          </template>

          <template v-slot:item.cost="{ item }">
            <div
              v-if="item.cost || ( item.front && item.front.cost)"
              style="display: flex; align-content: center; flex-direction: row; justify-content: center; align-items: center;"
            >
              <oath-symbol v-for="(c, i) in item.cost || item.front.cost" :key="i" :symbol="c" :size="16" />
            </div>
          </template>

          <template v-slot:item.text="{ item }">
            <div v-if="item.__type === 'edifice'" >
              <div><symbol-text :html="formatText(item.front.text)"></symbol-text></div>
              <hr>
              <div><symbol-text :html="formatText(item.ruined.text)"></symbol-text></div>
            </div>
            <symbol-text v-else :html="formatText(item.text)"></symbol-text>
          </template>

          <template v-slot:item.preview="{ item }">
            <v-btn icon @click="showPreviewCard(item)">
              <v-icon>mdi-file-find</v-icon>
            </v-btn>
          </template>

          <template v-slot:item.actions="{ item }">
            <div style="display: flex">
              <v-btn icon color="primary" :to="`builder/${item.id}`"><v-icon>mdi-pencil</v-icon></v-btn>
              <v-btn v-if="false" icon @click=""><v-icon>mdi-share-variant</v-icon></v-btn>
              <v-btn icon @click="removeCard(item.id)"><v-icon color="error">mdi-delete</v-icon></v-btn>
            </div>
          </template>

        </v-data-table>
      </v-col>
    </client-only>

    <v-dialog
      v-model="showPreviewDialog"
      max-width="1000"
      style="height: 378mm;"
    >
      <v-card v-if="previewCard">
        <v-card-title style="color: white; background: #131212;">
          Preview:
          <v-spacer></v-spacer>
          <v-btn
            icon
            @click="showPreviewDialog = false"
            color="white"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="mt-4">
          <component
            :is="dynamicCard(previewCard.__type)"
            :card="previewCard"
            :back="['denizen', 'relic'].includes(previewCard.__type)"
            :factor="2"
            fixed-width
            show-cutter
            show-blend
            enable-sharing
            enable-flipping
          ></component>
        </v-card-text>
      </v-card>
    </v-dialog>

  </v-row>

</template>

<script>
import marked from "marked";
import DOMPurify from "isomorphic-dompurify";
import SeoHead from "@/mixins/SeoHead";
const DenizenCardWrapper = () => import( /* webpackChunkName: "DenizenCardWrapper" */ '~/components/DenizenCardWrapper.vue' );
const RelicCardWrapper = () => import( /* webpackChunkName: "RelicCardWrapper" */ '~/components/RelicCardWrapper.vue' );
const SiteCardWrapper = () => import( /* webpackChunkName: "SiteCardWrapper" */ '~/components/SiteCardWrapper.vue' );
const EdificeCardWrapper = () => import( /* webpackChunkName: "EdificeCardWrapper" */ '~/components/EdificeCardWrapper.vue' );


export default {
  name: 'index',
  mixins: [SeoHead],
  data() {
    return {
      toolbar: {
        create: [
          { text: 'Create Denizen', value: 'denizen' },
          { text: 'Create Site', value: 'site' },
          { text: 'Create Relic', value: 'relic' },
          { text: 'Create Edifice', value: 'edifice' },
        ],
      },
      table: {
        headers: [
          { text: 'Category', value: '__type' },
          { text: 'Preview', value: 'preview' },
          { text: 'Suit', value: 'suit', align: 'center' },
          { text: 'Name', value: 'name' },
          { text: 'Restriction', value: 'restriction' },
          { text: 'Type', value: 'type' },
          { text: 'Cost', value: 'cost', align: 'center' },
          { text: 'Text', value: 'text' },
          { text: 'Actions', value: 'actions' },
        ],
      },
      search: '',
      showPreviewDialog: false,
      previewCard: null,
    };
  },
  head() {
    const title = `Oath Card Builder`;
    let description = `Create your own variants of Denizens, Sites, Relics and Edifices for the Boardgame Oath.`;
    const image = `https://oath-card-builder.herokuapp.com/img/seo/index.png`;
    return {
      ...this.seo(title, description, image),
    }
  },
  computed: {
    lastType() {
      return this.$store.getters['library/lastType'] || 'denizen';
    },
    library() {
      return this.$store.getters['library/cardSets'];
    },
  },
  methods: {
    formatText(text) {
      const renderer = { del(text) { return `~${text}~`; } };
      marked.use({ renderer });
      return text ? marked.parseInline(DOMPurify.sanitize(text)) : '';
    },
    showPreviewCard(card) {
      this.previewCard = card;
      this.showPreviewDialog = true;
    },
    dynamicCard(cardType) {
      switch (cardType) {
        case 'denizen': return DenizenCardWrapper;
        case 'edifice': return EdificeCardWrapper;
        case 'relic': return RelicCardWrapper;
        case 'site': return SiteCardWrapper;
        default:
          return null;
      }
    },
    removeCard(cardId) {
      this.$store.commit('library/deleteCard', cardId);
    },
    createAndOpenEditor(type = this.lastType) {
      this.$store.dispatch('library/createCard', type)
        .then((id) => {
          console.info(`New card with id ${id} created, opening editor.`);
          this.$store.commit('library/setLastType', type);
          this.$router.push(`/builder/${id}`);
        });
    },
  }
}
</script>

<style scoped>

</style>
