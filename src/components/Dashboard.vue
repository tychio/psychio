<template>
<main class="phone-viewport">
  <section class="container">
    <h1 class="md-display-2">PsychIO</h1>
    <md-button class="md-raised md-accent" @click.native="play">Play</md-button>
  </section>
  <section :class="['container', {
    'processing': current >= 0
  }]" ref="container">
    <div v-for="(item, index) in list" v-if="current >= index" v-show="current <= index">
      <component :is="item.type" :item="item" @end="next"
      ></component>
    </div>
  </section>
</main>
</template>

<script>
import * as screenfull from 'screenfull'
import PictureNaming from './PictureNaming'

export default {
  name: 'Dashboard',
  data () {
    let data = {
      current: -1,
      list: [
        {
          type: 'picture-naming',
          name: 'tiger',
          src: 'act020bow'
        },
        {
          type: 'picture-naming',
          name: 'dog',
          src: 'act045conduct'
        }
      ],
      results: []
    }
    return data
  },
  methods: {
    play: function () {
      this.current = -1
      this.results = []
      if (screenfull.enabled) {
        screenfull.request(this.$refs.container)
      }
      this.$nextTick(() => {
        this.current = 0
      })
    },
    next: function (result) {
      if (result) {
        this.results.push(result)

        if (this.current === this.list.length - 1) {
          this.current = -1
          screenfull.exit()
          console.log(this.results)
        } else {
          setTimeout(() => {
            this.current++
          }, 2000)
        }
      }
    }
  },
  components: {
    'picture-naming': PictureNaming
  }
}
</script>

<style>
.container {
  overflow: hidden;
  height: 100%;
  width: 100%;
}

.container.processing {
  background: #ccc;
}
</style>
