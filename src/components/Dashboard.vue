<template>
<main class="phone-viewport">
  <section class="container">
    <h1 class="md-display-2">PsychIO</h1>
    <md-button class="md-raised md-accent" @click.native="play">Play</md-button>
  </section>
  <section class="container">
    <div v-for="(item, index) in list" v-if="current >= index" v-show="current <= index">
      <component :is="item.type" :item="item" @end="next"
      ></component>
    </div>
  </section>
</main>
</template>

<script>
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
          url: 'http://lorempixel.com/400/200/animals/3/'
        },
        {
          type: 'picture-naming',
          name: 'dog',
          url: 'http://lorempixel.com/400/200/animals/8/'
        }
      ]
    }
    return data
  },
  methods: {
    play: function () {
      this.current = -1
      this.$nextTick(() => {
        this.next()
      })
    },
    next: function () {
      this.current++
      console.log(this.current)
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
  margin: 10px;
}
</style>
