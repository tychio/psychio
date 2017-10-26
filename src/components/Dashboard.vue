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
      <component :is="type" :item="item" :language="language" @end="next"
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
          <img :src="result.src">
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
      results: [],
      SECTION_COUNT: 4
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
        screenfull.onchange(event => {
          if (!screenfull.isFullscreen) {
            this.current = -1
          }
        })
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
      const another = {}
      another[languages[0]] = languages[1]
      another[languages[1]] = languages[0]
      const imgGroups = _.flatten([this.groupImages(this.items), this.groupImages(this.items)])
      let imagesCount = _.size(_.flatten(imgGroups))
      const pairCount = imagesCount - imgGroups.length
      let changeLanguagesCount = _.round((pairCount) * 0.7)
      const keepLanguagesCount = _.round((pairCount - changeLanguagesCount) * 0.5)
      const keepLanguagesCounter = {}
      _.each(languages, languageName => {
        keepLanguagesCounter[languageName] = keepLanguagesCount
      })
      const itemGroups = _.map(imgGroups, (imgGroup, groupIndex) => {
        let languageName = languages[groupIndex > this.SECTION_COUNT ? 1 : 0]
        return _.map(imgGroup, (image, index) => {
          let isChange = null
          if (index > 0) {
            isChange = false
          }
          if (isChange !== null) {
            const randomValue = _.random(true)
            const shouldChange = randomValue < (changeLanguagesCount / imagesCount)
            const canNotKeep = keepLanguagesCounter[languageName] === 0
            const mustKeep = changeLanguagesCount === 1 && keepLanguagesCounter[languageName] > 0
            if (!mustKeep && (shouldChange || canNotKeep)) {
              languageName = another[languageName]
              changeLanguagesCount--
              isChange = true
            } else {
              keepLanguagesCounter[languageName]--
            }
          }
          imagesCount--
          const item = {
            name: image,
            language: languageName,
            isEnd: imgGroup.length === (index + 1),
            isChange: isChange
          }
          if (isChange) {
            console.count('Changed from ' + another[languageName] + ' to ' + languageName)
          } else if (isChange === false) {
            console.count('Keep ' + languageName)
          } else {
            console.count('First ' + languageName)
          }
          return item
        })
      })
      const randomItemGroups = _.sampleSize(itemGroups, this.SECTION_COUNT)

      _.each(randomItemGroups, itemGroup => {
        console.group('=========================================')
        _.each(itemGroup, item => {
          console.group('---------------------')
          console.log('picture name:', item.name)
          console.log('language:', item.language)
          if (item.isChange) {
            console.log('Changed')
          } else {
            console.log('Not changed')
          }
          console.groupEnd('---------------------')
        })
        console.groupEnd('<=========================================>')
      })

      return _.flatten(randomItemGroups)
    },
    groupImages: function (imgs) {
      const RANGE = 4
      const imageCountInGroup = imgs.length
      const minRange = imageCountInGroup - RANGE
      const maxRange = imageCountInGroup + RANGE
      let left = 0
      const groups = _.chain(Array(this.SECTION_COUNT)).map((val, index) => {
        return (function (self) {
          let min = minRange
          let max = maxRange
          if (left > 0) {
            min += left
          } else {
            max += left
          }
          if (index + 1 === self.SECTION_COUNT) {
            return imageCountInGroup + left
          } else {
            const size = _.random(min, max)
            left += (imageCountInGroup - size)
            return size
          }
        })(this)
      }).sortBy(size => size).value()
      const pool = _.flatten(_.fill(Array(this.SECTION_COUNT), imgs))
      let currentIndex = 0
      console.log('Sum:', _.sum(groups))
      console.log('Group count:', groups.join(','))
      const results = _.map(groups, count => {
        const result = _.slice(pool, currentIndex, currentIndex + count)
        currentIndex += count
        let gap = []
        const randomResult = _.sampleSize(result, count)
        const sortedResult = _.sortBy(randomResult, item => {
          const includes = _.includes(_.slice(gap, 0, 3), item)
          gap.unshift(item)
          return includes
        })
        return sortedResult
      })
      return results
    }
  },
  computed: {
    items: function () {
      return this.design[this.type]
    }
  },
  watch: {
    type: function () {
      this.results = []
    },
    language: function () {
      this.results = []
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
