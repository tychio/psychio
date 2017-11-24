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
      SECTION_COUNT: 6
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
    logPictures: function (randomItemGroups) {
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
    },
    randomPictures: function () {
      const uyghurGroups = this.randomPictureGroup('uyghur', this.groupImages(this.items))
      const ChineseGroups = this.randomPictureGroup('chinese', this.groupImages(this.items))
      this.logPictures(uyghurGroups)
      this.logPictures(ChineseGroups)
      return _.flattenDeep([uyghurGroups, ChineseGroups])
    },
    randomPictureGroup: function (languageName, imgGroups) {
      const languages = ['uyghur', 'chinese']
      const another = {}
      another[languages[0]] = languages[1]
      another[languages[1]] = languages[0]
      let imagesCount = _.size(_.flatten(imgGroups))
      const pairCount = imagesCount - imgGroups.length
      let changeLanguagesCount = _.round((pairCount) * (1 / 3))
      const keepLanguagesCount = _.round((pairCount - changeLanguagesCount) * 0.5)
      const keepLanguagesCounter = {}
      _.each(languages, langName => {
        keepLanguagesCounter[langName] = keepLanguagesCount
      })
      const itemGroups = _.map(imgGroups, (imgGroup, groupIndex) => {
        return _.map(imgGroup, (image, index) => {
          let isChange = null
          if (index > 0) {
            isChange = false
          }
          if (isChange !== null) {
            const randomValue = _.random(true)
            const totalCount = imagesCount - imgGroups.length + groupIndex + 1
            const shouldChange = randomValue < (changeLanguagesCount / totalCount)
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
      return _.sampleSize(itemGroups, this.SECTION_COUNT)
    },
    groupImages: function (imgs) {
      const imageCountInGroup = imgs.length
      const minRange = imageCountInGroup - this.SECTION_COUNT
      const maxRange = imageCountInGroup + this.SECTION_COUNT
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
        const randomResult = _.sampleSize(result, count)
        return this.sortedWithSpace(randomResult, 3)
      })
      return results
    },
    sortedWithSpace: function (arr, gap) {
      const results = []
      let cache = []
      const pick = item => {
        let cached = false
        if (!_.includes(_.slice(results, 0 - gap), item)) {
          results.push(item)
        } else if (!_.includes(_.slice(results, 0, gap), item)) {
          results.unshift(item)
        } else {
          cache.push(item)
          cached = true
        }
        return cached
      }
      _.each(arr, item => {
        pick(item)
        cache = _.filter(cache, pick)
      })
      console.log('sorted images:', results)
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
  background: white;
}

.form {
  width: 480px;
  margin: 0 auto;
}
</style>
