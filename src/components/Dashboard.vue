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
      <component :is="type" :item="item" @end="next"
      ></component>
    </div>
  </section>
</main>
</template>

<script>
import * as _ from 'lodash'
import * as screenfull from 'screenfull'
import PictureNaming from './PictureNaming'

export default {
  name: 'Dashboard',
  props: ['design'],
  data () {
    let data = {
      type: 'picture-naming',
      current: -1,
      list: [],
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
      this.list = this.random()
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
    },
    random: function () {
      const methodName = {
        'picture-naming': 'randomPictures'
      }[this.type]
      return this[methodName]()
    },
    randomPictures: function () {
      const randomSort = () => _.random(0, 1, true) > 0.5
      const languages = ['uyghur', 'chinese']
      const count = Math.round(this.items.length / languages.length)
      const languageList = _.flatMap(languages, lang => _.fill(Array(count), lang))
      return _.chain(this.items)
        .sortBy(randomSort)
        .map(item => {
          const index = _.random(0, languageList.length - 1)
          return {
            name: item,
            language: languageList.splice(index, 1)[0]
          }
        }).value()
    }
  },
  computed: {
    items: function () {
      return this.design[this.type]
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
