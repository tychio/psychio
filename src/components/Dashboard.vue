<template>
  <div>
    <h1>PsychIO</h1>
    <button @click="play()">Play</button>
    <div>
      <div class="time-container" v-for="timeline in timelines">
        <template v-if="timeline.type === 'img'">
          <div class="showcase" v-if="now > timeline.start && now<timeline.end">
            <img :src="timeline.url">
          </div>
          <div class="time-block" v-if="now === 0" :style="{width: ((timeline.end - timeline.start)/duration)*size.width + 'px'}">
              <img :src="timeline.url" height="60">
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data () {
    let data = {
      size: {
        width: 0,
        height: 0
      },
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
  computed: {
    duration: function () {
      return this.timelines[this.timelines.length - 1].end
    }
  },
  methods: {
    play: function () {
      const start = (new Date()).getTime()
      const timer = setInterval(() => {
        this.now = (new Date()).getTime() - start
        if (this.now > this.duration) {
          this.now = 0
          clearInterval(timer)
        }
      }, 500)
    },
    getWidth: function () {
      this.size.width = document.documentElement.clientWidth
    },
    getHeight: function () {
      this.size.height = document.documentElement.clientHeight
    }
  },
  mounted: function () {
    this.$nextTick(() => {
      window.addEventListener('resize', this.getWidth)
      window.addEventListener('resize', this.getHeight)

      this.getWidth()
      this.getHeight()
    })
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

.time-container {
  float: left;
}

.time-block {
  display: inline-block;
  border: 1px solid #333;
  box-sizing: border-box;
}

.time-block img {
  display: block;
  margin: 0 auto;
}
</style>
