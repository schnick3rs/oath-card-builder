<template>

  <v-row>

    <v-col>
      <v-btn to="/builder" color="primary">
        To the Card Builder
      </v-btn>
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


          <template v-slot:item.name="{ item }">
            <div v-if="item.__type === 'edifice'">
              <div>{{item.front.name}}</div>
              <div>{{item.ruined.name}}</div>
            </div>
            <span v-else>{{item.name}}</span>
          </template>

          <template v-slot:item.type="{ item }">
            <v-avatar :size="24" tile>
              <img v-if="item.__type === 'edifice'" :alt="item.front.type" :src="`/img/icons/type-${item.front.type}.png`" />
              <img v-else :alt="item.type" :src="`/img/icons/type-${item.type}.png`" />
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
              <div><symbol-text :html="formatText(item.ruined.text)"></symbol-text></div>
            </div>
            <symbol-text v-else :html="formatText(item.text)"></symbol-text>
          </template>

          <template v-slot:item.preview="{ item }">
            <v-btn icon @click="showPreviewCard(item)">
              <v-icon>mdi-file-find</v-icon>
            </v-btn>
          </template>

        </v-data-table>
      </v-col>
    </client-only>

    <v-dialog
      v-model="showPreviewDialog"
      max-width="500"
    >
      <v-card v-if="previewCard">
        <v-card-title style="color: white; background: #131212;">
          Preview: {{previewCard.name}}
        </v-card-title>
        <v-card-text class="mt-4">
          <component
            :is="dynamicCard(previewCard.__type)"
            :card="previewCard"
            :back="['denizen', 'relic'].includes(previewCard.__type)"
            fixed-width
          ></component>
        </v-card-text>
      </v-card>
    </v-dialog>

  </v-row>

</template>

<script>
import marked from "marked";
import DOMPurify from "isomorphic-dompurify";
const DenizenCardWrapper = () => import( /* webpackChunkName: "DenizenCardWrapper" */ '~/components/DenizenCardWrapper.vue' );
const RelicCardWrapper = () => import( /* webpackChunkName: "RelicCardWrapper" */ '~/components/RelicCardWrapper.vue' );
const SiteCardWrapper = () => import( /* webpackChunkName: "SiteCardWrapper" */ '~/components/SiteCardWrapper.vue' );
const EdificeCardWrapper = () => import( /* webpackChunkName: "EdificeCardWrapper" */ '~/components/EdificeCardWrapper.vue' );


export default {
  name: 'index',
  data() {
    return {
      table: {
        headers: [
          { text: 'Category', value: '__type' },
          { text: 'Preview', value: 'preview' },
          { text: 'Suit', value: 'suit', align: 'center' },
          { text: 'Name', value: 'name' },
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
  computed: {
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
  }
}
</script>

<style scoped>

</style>
