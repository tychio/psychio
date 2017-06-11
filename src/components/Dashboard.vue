<template>
<main>
  <section class="container">
    <h1 class="md-display-2">PsychIO</h1>
    <md-button class="md-raised md-accent" @click.native="play">Play</md-button>
  </section>
  <section class="container">
    <Timeline 
      :list="list" 
      :currentIndex="currentIndex"
      @append="appendItem"
      @remove="removeItem"
    ></Timeline>
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
          name: 'Tiger',
          url: 'http://lorempixel.com/400/200/animals/3/',
          audio: '',
          period: 3000
        },
        {
          type: 'img-audio',
          name: 'dog',
          url: 'http://lorempixel.com/400/200/animals/8/',
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
        duration += parseInt(item.period)
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
    },
    appendItem: function (item) {
      this.list.push(item)
    },
    removeItem: function (index) {
      this.list.splice(index, 1)
    }
  },
  components: {
    Timeline
  }
}
</script>

<style>
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
