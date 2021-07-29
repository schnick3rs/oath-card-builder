<template>
  <div>
    <div style="font-family: OathCapital">.</div>
    <div style="font-family: OathText">.</div>
    <v-text-field v-model.number="canvas.factor" type="number" label="factor"></v-text-field>
    <canvas id="cv" width="460" height="356"></canvas>
    <v-btn @click="draw">Draw</v-btn>
  </div>
</template>

<script>
export default {
  name: "canvas",
  data() {
    return {
      card: {
        name: 'Floating City',
        image: 'https://i.pinimg.com/originals/1b/ef/1a/1bef1a983ec32b11db534ca132a7c243.jpg',
        resources: '1122',
        relics: 1,
        capacity: 2,
        relicRecoverCost: '111>a',
      },
      canvas: {
        factor: 4,
      },
      site: {
        height: 89,
        width: 115,
      }
    };
  },
  computed: {
    canvasHeight() {
      return this.canvas.factor * this.site.height;
    },
    canvasWidth() {
      return this.canvas.factor * this.site.width;
    },
  },
  methods: {
    draw() {
      let cv = document.getElementById('cv');
      let ct = cv.getContext('2d');
      //ct.save();

      ct.mozImageSmoothingEnabled = true;
      ct.webkitImageSmoothingEnabled = true;
      ct.msImageSmoothingEnabled = true;
      ct.imageSmoothingEnabled = true;

      const F = this.canvas.factor;

      let w = cv.width;
      let h = cv.height;

      ct.clearRect(0, 0, w, h);

      function capitalText(ctx, str, fontSize, x, y){
        let previousChar = '';
        for(let i = 0; i <= str.length; ++i){
          let ch = str.charAt(i);
          ctx.font = i === 0 || previousChar === ' '
            ? `${fontSize}px OathCapital`
            : `${fontSize}px OathText`;
          ctx.fillText(ch, x, y);
          x += ctx.measureText(ch).width;
          previousChar = ch;
        }
      }

      let image = new Image(); {
        image.src = this.card.image;
        image.onload = () => {
          ct.drawImage(image, 0, 0, w, h);

          let frame = new Image();
          frame.src = '/img/site 0 relics.png';
          frame.onload = () => {
            ct.drawImage(frame, 0, 0, w, h);

            this.card.resources.split('').forEach((c, i) => {
              let icon = new Image();
              icon.src = c === '1' ? '/img/icons/favor.png' : '/img/icons/secret.png';
              const x = 5*F + 4*F*i;
              icon.onload = () => { ct.drawImage(icon, x, 8*F, 5*F, 5*F); }
            });

            ct.font = `${9*F}px OathCapita`;
            ct.fillStyle = 'black';
            capitalText(ct, this.card.name, 9*F, 30*F, cv.height-(5*F));
          }
        }
      }

    }
  }
}
</script>

<style scoped>

</style>
