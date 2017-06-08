<template>
<main>
  <section class="container">
    <h1>PsychIO</h1>
    <button class="btn" @click="play()">Play</button>
  </section>
  <section class="container" ref="container">
    <div class="timeline">
      <div class="timeline-block" v-for="(item,index) in outputs">
        <div v-if="item.type === 'img'">
          <img :src="item.url" height="100">
          <div class="showcase" v-if="index === currentIndex">
            <img :src="item.url">
          </div>
        </div>
        <div>
          <input type="number" v-model="item.period">
        </div>
      </div>
    </div>
    <div class="timeline">
      <div class="timeline-block" v-for="item in inputs">
        <Recorder :active="now > item.start && now <= item.end" :audio="item"></Recorder>
      </div>
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
      outputs: [
        {
          type: 'img',
          url: 'http://pic.baike.soso.com/ugc/baikepic2/4691/20150114182042-1266615931.jpg/300',
          period: 3000
        },
        {
          type: 'img',
          url: 'http://demo14.delsen.net.cn/kepuziyuan/images/dwwg7.jpg',
          period: 2000
        }
      ],
      inputs: [
        {
          type: 'audio',
          url: '',
          start: 0,
          end: 3000
        },
        {
          type: 'audio',
          url: '',
          start: 3000,
          end: 5000
        }
      ]
    }
    return data
  },
  computed: {
    duration: function () {
      let duration = 0
      this.outputs.forEach(function (item) {
        duration += item.period
      })
      return duration
    },
    currentIndex: function () {
      let current
      let passTime = this.now
      for (let index = -1; index < this.outputs.length; index++) {
        let item = this.outputs[index + 1]
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
  width: 50%;
}

.timeline-block {
  display: block;
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

input[type="number"] {
  width: 50px;
}
</style>
