<template>
<main class="phone-viewport">
  <section class="container">
    <form class="form">
      <div class="col-half">
        <md-input-container>
          <label>Your Name/你的名字</label>
          <md-input v-model="yourname"></md-input>
        </md-input-container>
        <md-input-container>
          <label>Contact/联系方式</label>
          <md-input required v-model="contact"></md-input>
        </md-input-container>
      </div>
      <md-input-container>
        <label>Test Type/测试类型</label>
        <md-select name="type" v-model="type">
          <md-option :value="TYPE_PIC">Picture Naming/图片命名</md-option>
          <md-option :value="TYPE_LEX">Lexical Decision/词汇判断</md-option>
          <md-option :value="TYPE_IQ">IQ Test/IQ测试</md-option>
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
    <div class="error" v-if="showError && !contact">Please enter contact/请填写联系方式</div>
    <md-button class="md-raised md-accent" @click.native="play">Play</md-button>
    <md-button v-if="hasData" class="md-raised md-warn" @click.native="download">Download</md-button>
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
    <md-list v-if="type === TYPE_PIC">
      <md-list-item v-for="(result, index) in results[TYPE_PIC]" 
        :href="blobUrl(result.record)"
        :target="'_blank'"
        key="index"
      >
        <md-avatar>
          <img :src="result.src">
        </md-avatar>
        <span>{{result.name}} - ({{result.response}}ms)</span>
        <span>[{{result.language}}]</span>
      </md-list-item>
    </md-list>
    <md-list v-if="type === TYPE_LEX" v-for="(typeLex, typeIdx) in [TYPE_LEX_CN, TYPE_LEX_UG]" key="typeIdx">
      <md-list-item v-if="sumType === typeLex" v-for="(result, index) in results[typeLex]" key="index">
        <md-avatar>
          <img :src="result.src">
        </md-avatar>
        <span>{{result.name}} - ({{result.response}}ms)</span>
        <span>[{{result.language}}]</span>
        <small>Choice/选择(Fact/实际)：{{result.right ? 'True/真' : 'False/假'}}({{!result.isNon ? 'True/真' : 'False/假'}})</small>
        <md-icon v-if="result.right !== result.isNon" md-theme="green" class="md-primary">done</md-icon>
        <md-icon v-else md-theme="orange" class="md-warn">clear</md-icon>
      </md-list-item>
    </md-list>
    <md-list v-if="type === TYPE_IQ">
      <md-list-item v-for="(result, index) in results[sumType]" key="index">
        <md-avatar>
          <img :src="result.src">
        </md-avatar>
        <span>{{result.name}} - ({{result.response}}ms)</span>
        <span>Answer/答案 - Choice/作答：<small>{{result.answer}}</small> - {{result.choice}}</span>
        <md-icon v-if="result.answer === result.choice" md-theme="green" class="md-primary">done</md-icon>
        <md-icon v-else md-theme="orange" class="md-warn">clear</md-icon>
      </md-list-item>
    </md-list>
  </section>
</main>
</template>

<script>
import * as _ from 'lodash'
import Jszip from 'jszip'
import * as screenfull from 'screenfull'
import { saveAs } from 'file-saver'
import PictureNaming from './PictureNaming'
import LexicalDecision from './LexicalDecision'
import IQTester from './IQTester'

export default {
  name: 'Dashboard',
  props: ['design'],
  data () {
    let data = {
      type: '',
      TYPE_PIC: 'picture-naming',
      TYPE_IQ: 'iq-tester',
      TYPE_LEX: 'lexical-decision',
      TYPE_LEX_CN: 'lexical-decision-chinese',
      TYPE_LEX_UG: 'lexical-decision-uyghur',
      language: 'chinese',
      current: -1,
      list: [],
      results: {},
      SECTION_COUNT: 6,
      showError: false,
      yourname: '',
      contact: ''
    }
    data.type = data.TYPE_PIC
    data.results[data.TYPE_PIC] = []
    data.results[data.TYPE_LEX_CN] = []
    data.results[data.TYPE_LEX_UG] = []
    data.results[data.TYPE_IQ] = []
    return data
  },
  methods: {
    blobUrl: function (url) {
      return url && URL.createObjectURL(url)
    },
    play: function () {
      if (!this.contact) {
        this.showError = true
        return
      }
      this.current = -1
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
        this.results[this.sumType].push(result)

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
      const mapper = {}
      mapper[this.TYPE_PIC] = 'randomPictures'
      mapper[this.TYPE_LEX] = 'randomLexical'
      mapper[this.TYPE_IQ] = 'randomIQ'
      const methodName = mapper[this.type]
      return this[methodName]()
    },
    randomIQ: function () {
      return this.items
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
    },
    download: function () {
      const zip = new Jszip()
      _.each(this.results, (result, type) => {
        _.each(result, (item, index) => {
          const fileName = [
            type,
            (_.fill(Array(3), '0').join('') + (index + 1)).slice(-3)
          ].join('_')
          const folder = zip.folder(fileName)
          if (item.record) {
            folder.file(fileName + '.wav', item.record)
          }
          folder.file(fileName + '.json', JSON.stringify(item))
        })
      })

      zip.file('info.json', JSON.stringify({
        name: this.yourname,
        contact: this.contact
      }))

      zip.generateAsync({type: 'blob'})
      .then(content => {
        saveAs(content, 'psychio_results_' + this.contact + '.zip')
      })
    }
  },
  computed: {
    items: function () {
      return this.design[this.type]
    },
    sumType: function () {
      let type = this.type
      if (type === this.TYPE_LEX) {
        type += '-' + this.language
      }
      return type
    },
    hasData: function () {
      const hasPictures = this.results[this.TYPE_PIC].length
      const hasLexicalChinese = this.results[this.TYPE_LEX_CN].length
      const hasLexicalUyghur = this.results[this.TYPE_LEX_UG].length
      return hasPictures || hasLexicalChinese || hasLexicalUyghur
    }
  },
  components: {
    'picture-naming': PictureNaming,
    'lexical-decision': LexicalDecision,
    'iq-tester': IQTester
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

.col-half {
  overflow: hidden;
  width: 102%;
  margin: 0 -1%;
}

.col-half>div {
  float: left;
  width: 48%;
  margin: 1%;
}

.error {
  color: #cc5500;
}
</style>
