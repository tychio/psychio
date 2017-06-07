<template>
<main>
  <section class="container">
    <h1>PsychIO</h1>
    <button class="btn" @click="play()">Play</button>
  </section>
  <section class="container">
    <div v-for="timeline in timelines">
      <template v-for="block in timeline.content">
        <div class="showcase" v-if="timeline.type === 'img' && now > block.start && now<=block.end">
          <img :src="block.url">
        </div>
      </template>
    </div>
  </section>
  <section class="container" ref="container">
    <div class="timeline" v-for="timeline in timelines">
      <template v-if="timeline.type === 'img'">
        <div class="timeline-block" v-for="block in timeline.content" :style="{width: ((block.end - block.start)/duration)*size.width + 'px'}">
          <img :src="block.url" height="60">
        </div>
      </template>

      <template v-else-if="timeline.type === 'audio'">
        <div class="timeline-block" v-for="block in timeline.content" :style="{width: ((block.end - block.start)/duration)*size.width + 'px'}">
          <Recorder :active="now > block.start && now<=block.end" :audio="block"></Recorder>
        </div>
      </template>
    </div>
  </section>
</main>
</template>

<script>
import Recorder from './recorder'

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
          content: [{
            url: 'http://pic.baike.soso.com/ugc/baikepic2/4691/20150114182042-1266615931.jpg/300',
            start: 0,
            end: 3000
          },
          {
            url: 'http://demo14.delsen.net.cn/kepuziyuan/images/dwwg7.jpg',
            start: 3000,
            end: 5000
          }]
        },
        {
          type: 'audio',
          content: [
            {
              url: '',
              start: 0,
              end: 3000
            },
            {
              url: '',
              start: 3000,
              end: 5000
            }
          ]
        }
      ]
    }
    return data
  },
  computed: {
    duration: function () {
      let maxDuration = 0
      this.timelines.forEach(function (timeline) {
        let duration = timeline.content[timeline.content.length - 1].end
        maxDuration = Math.max(duration, maxDuration)
      })
      return maxDuration
    }
  },
  methods: {
    play: function () {
      const start = (new Date()).getTime()
      const self = this
      const timer = setInterval(() => {
        self.now = (new Date()).getTime() - start
        if (self.now > self.duration) {
          self.now = 0
          clearInterval(timer)
        }
      }, 500)
    },
    getWidth: function () {
      this.size.width = this.$refs.container.clientWidth
    }
  },
  mounted: function () {
    this.$nextTick(() => {
      window.addEventListener('resize', this.getWidth)
      this.getWidth()
    })
  },
  components: {
    Recorder
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  overflow: hidden;
  margin: 10px;
}

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

.timeline {
  float: left;
}

.timeline-block {
  display: inline-block;
  box-sizing: border-box;
  border: 1px solid #333;
}

.timeline-block img {
  display: block;
  margin: 0 auto;
}

.btn {
  width: 200px;
  height: 50px;
  line-height: 40px;
  text-align: center;
  font-size: 32px;
}
</style>
