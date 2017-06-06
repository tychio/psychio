<template>
  <div>
    <h1>PsychIO</h1>
    <button @click="play()">Play</button>
    <ul v-if="now > 0">
      <li v-for="timeline in timelines">
        <div class="showcase" v-if="timeline.type == 'img'">
          <img :src="timeline.url" v-show="now > timeline.start && now<timeline.end">
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data () {
    let data = {
      now: 0,
      timelines: [
        {
          type: 'img',
          url: 'http://pic.baike.soso.com/ugc/baikepic2/4691/20150114182042-1266615931.jpg/300',
          start: 0,
          end: 3000
        },
        {
          type: 'img',
          url: 'http://demo14.delsen.net.cn/kepuziyuan/images/dwwg7.jpg',
          start: 3000,
          end: 5000
        }
      ]
    }
    return data
  },
  methods: {
    play: function () {
      const start = (new Date()).getTime()
      const timer = setInterval(() => {
        this.now = (new Date()).getTime() - start
        if (this.now > this.timelines[this.timelines.length - 1].end) {
          this.now = 0
          clearInterval(timer)
        }
      }, 500)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.showcase {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.showcase img {
  width: 100%;
  height: 100%;
}
</style>
