<template>
  <div>
    <v-alert type="info" text>
      Create a large PNG usable for the <a href="https://store.steampowered.com/app/286160/Tabletop_Simulator/">TableTopSimulator</a> (Steam link).
    </v-alert>
    <v-container>
      <v-row>
        <v-col
          :cols="12"
          v-for="(deck, name) in groupedDeck"
        >
          <tts-canvas
            :name="name"
            :deck="deck"
          >
          </tts-canvas>
        </v-col>
      </v-row>
    </v-container>
    <div class="export-area">

    </div>
  </div>
</template>

<script>
import SeoHead from "@/mixins/SeoHead";

export default {
  name: "tts-export",
  mixins: [SeoHead],
  data() {
    return {
      printBack: false,
    };
  },
  head() {
    const title = `Export PNG for TTS`;
    let description = `Create and download a large PNG file containing all your denizen.`;
    const image = `https://oath-card-builder.herokuapp.com/img/seo/index.png`;
    return {
      ...this.seo(title, description, image),
    }
  },
  computed: {
    library() {
      return this.$store.getters['library/cardSets'];
    },
    groupedDeck() {
      return this.library.reduce((groups, card) => {
        if (card.__type === 'edifice') {

          {
            const group = 'edifice-intact';
            if(!groups[group]) groups[group] = [];
            groups[group].push({
              ...card.front,
              edifice: true,
            });
          }

          {
            const group = 'edifice-ruined';
            if(!groups[group]) groups[group] = [];
            groups[group].push(card.ruined);
          }

        } else {
          const group = card.__type;
          if(!groups[group]) groups[group] = [];
          groups[group].push(card);
        }
        return groups;
      }, {});
    },
  },
}
</script>

<style scoped lang="scss">
@media screen {
  .help {
  }
}

@media print {
  .help {
    display: none;
  }
}
</style>
