<template>
<main>
  <section class="container">
    <h1>PsychIO</h1>
    <button class="btn" @click="play()">Play</button>
  </section>
  <section class="container">
    <Timeline :list="list" :currentIndex="currentIndex"></Timeline>
  </section>
</main>
</template>

<script>
import Timeline from './timeline'

export default {
  name: 'Dashboard',
  data () {
    let data = {
      now: 0,
      list: [
        {
          type: 'img-audio',
          url: 'http://pic.baike.soso.com/ugc/baikepic2/4691/20150114182042-1266615931.jpg/300',
          audio: '',
          period: 3000
        },
        {
          type: 'img-audio',
          url: 'http://demo14.delsen.net.cn/kepuziyuan/images/dwwg7.jpg',
          audio: '',
          period: 2000
        }
      ]
    }
    return data
  },
  computed: {
    duration: function () {
      let duration = 0
      this.list.forEach(function (item) {
        duration += item.period
      })
      return duration
    },
    currentIndex: function () {
      let current
      let passTime = this.now
      for (let index = -1; index < this.list.length; index++) {
        let item = this.list[index + 1]
        if (passTime <= 0) {
          current = index
          break
        }
        passTime -= item.period
      }
      return current
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
      }, 50)
    }
  },
  components: {
    Timeline
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  overflow: hidden;
  margin: 10px;
}

.btn {
  width: 200px;
  height: 50px;
  line-height: 40px;
  text-align: center;
  font-size: 32px;
}
</style>
