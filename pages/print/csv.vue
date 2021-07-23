<template>
  <div>
    <div class="screen">
      <v-container>
        <v-row>
          <v-col cols="4">
            <v-file-input
              label="Csv File"
              dense outlined
              v-model="file"
              @change="parseCsv"
            ></v-file-input>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <page>
      <denizen-card-wrapper
        v-for="card in data"
        :card="card"
        :back="false"
      ></denizen-card-wrapper>
    </page>
  </div>
</template>

<script>
export default {
  name: "csv",
  layout: 'print',
  data() {
    return {
      file: undefined,
      data: undefined,
      cards: [],
    };
  },
  methods: {
    parseCsv() {
      if (this.file) {
        const reader = new FileReader();

        function csvToArray(str, delimiter = ";") {
          // slice from start of text to the first \n index
          // use split to create an array from string by delimiter
          const headers = str.slice(0, str.indexOf("\n")).split(delimiter);

          // slice from \n index + 1 to the end of the text
          // use split to create an array of each csv value row
          const rows = str.slice(str.indexOf("\n") + 1).split("\n");

          // Map the rows
          // split values from each row into an array
          // use headers.reduce to create an object
          // object properties derived from headers:values
          // the object passed as an element of the array
          const arr = rows.map(function (row) {
            const values = row.split(delimiter);
            const el = headers.reduce(function (object, header, index) {
              object[header] = values[index];
              return object;
            }, {});
            return el;
          });

          // return the array
          return arr;
        }

        reader.onload = (e) => {
          const text = e.target.result;
          let data = csvToArray(text);
          this.data = data.filter(item => item.name !== '' );
        };

        reader.readAsText(this.file);
      }
    },
  },
}
</script>

<style scoped lang="scss">
@media print {
  .screen {
    display: none;
  }
}
</style>
