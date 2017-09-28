<template>
<main class="phone-viewport">
  <section class="container">
    <h1 class="md-display-2">PsychIO</h1>
    <form class="form">
      <md-input-container>
        <label>Test Type/测试类型</label>
        <md-select name="type" v-model="type">
          <md-option value="picture-naming">Picture Naming/图片命名</md-option>
          <md-option value="lexical-decision">Lexical Decision/词汇判断</md-option>
        </md-select>
      </md-input-container>
      <md-input-container v-if="type === 'lexical-decision'">
        <label>Languages/语言</label>
        <md-select name="type" v-model="language">
          <md-option value="chinese">Chiese/中文</md-option>
          <md-option value="uyghur">Uyghur/维文</md-option>
        </md-select>
      </md-input-container>
    </form>
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
  <section class="container">
    <md-list>
      <md-list-item v-for="(result, index) in results" 
        :href="blobUrl(result.record)"
        :target="'_blank'"
        key="index"
      >
        <md-avatar>
          <img :src="'./static/pictures/' + result.name + '.gif'">
        </md-avatar>
        <span>{{result.name}} - ({{result.response}}ms)</span>
        <span v-if="result.language">[{{result.language}}]</span>
        <template v-if="type === 'lexical-decision'">
          <small>Choice/选择(Fact/实际)：{{result.right ? 'True/真' : 'False/假'}}({{!result.isNon ? 'True/真' : 'False/假'}})</small>
          <md-icon v-if="result.right !== result.isNon" md-theme="green" class="md-primary">done</md-icon>
          <md-icon v-else md-theme="orange" class="md-warn">clear</md-icon>
        </template>
      </md-list-item>
    </md-list>
  </section>
</main>
</template>

<script>
import * as _ from 'lodash'
import * as screenfull from 'screenfull'
import PictureNaming from './PictureNaming'
import LexicalDecision from './LexicalDecision'

export default {
  name: 'Dashboard',
  props: ['design'],
  data () {
    let data = {
      type: 'picture-naming',
      language: 'chinese',
      current: -1,
      list: [],
      results: []
    }
    return data
  },
  methods: {
    blobUrl: function (url) {
      return url && URL.createObjectURL(url)
    },
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
        } else {
          setTimeout(() => {
            this.current++
          }, 500)
        }
      }
    },
    random: function () {
      const methodName = {
        'picture-naming': 'randomPictures',
        'lexical-decision': 'randomLexical'
      }[this.type]
      return this[methodName]()
    },
    randomLexical: function () {
      const languageGroup = this.items[this.language]
      const nonwords = _.map(languageGroup.nonwords, word => {
        return {
          name: word,
          isNon: true
        }
      })
      const words = _.map(languageGroup.words, word => {
        return {
          name: word,
          isNon: false
        }
      })
      const allWords = _.concat(nonwords, words)
      return _.sampleSize(allWords, allWords.length)
    },
    randomPictures: function () {
      const languages = ['uyghur', 'chinese']
      const length = languages.length
      const count = Math.round(this.items.length / (length * length))
      const lines = []
      for (let from = 0; from < length; from++) {
        for (let to = 0; to < length; to++) {
          lines.push({
            count: count,
            direction: [from, to]
          })
        }
      }
      return _.chain(this.items)
        .sortBy(() => _.random(0, 1, true) > 0.5)
        .reduce((items, item) => {
          const lastOne = items.length > 0 ? items[items.length - 1] : {}
          const lastLangIndex = languages.indexOf(lastOne.language)
          let language = _.sample(languages)
          if (lastLangIndex >= 0) {
            const randomLine = _.sample(_.filter(lines, line => {
              const fromIndex = line.direction[0]
              const matchFrom = fromIndex === lastLangIndex
              let hasCount = line.count > 0
              const turned = fromIndex !== line.direction[1]
              if (turned) {
                const currentDirection = _.find(lines, line => line.direction.join('|') === [fromIndex, fromIndex].join('|'))
                hasCount = line.count > 1 || (line.count === 1 && currentDirection.count === 0)
              }
              return hasCount && matchFrom
            }))
            randomLine.count--
            language = languages[randomLine.direction[1]]
          }
          items.push({
            name: item,
            language: language
          })
          return items
        }, []).value()
    }
  },
  computed: {
    items: function () {
      return this.design[this.type]
    }
  },
  components: {
    'picture-naming': PictureNaming,
    'lexical-decision': LexicalDecision
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

.form {
  width: 480px;
  margin: 0 auto;
}
</style>
