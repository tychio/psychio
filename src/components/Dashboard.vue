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
        <md-switch v-model="realMode">{{realMode ? '实测' : '示例'}}模式</md-switch>
      </md-input-container>
      <md-input-container>
        <label>Test Type/测试类型</label>
        <md-select name="type" v-model="type">
          <md-option :value="TYPE_PIC">Picture Naming/图片命名</md-option>
          <md-option :value="TYPE_LEX">Lexical Decision/词汇判断</md-option>
          <md-option :value="TYPE_FLANKER">Flanker/箭头测试</md-option>
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
    <md-button class="md-raised md-accent" @click.native="start">Start</md-button>
    <md-button v-if="hasData" class="md-raised md-primary" @click.native="download">Export</md-button>
  </section>
  <section :class="['container', {
    'processing': current >= 0
  }]" ref="container">
    <div v-for="(item, index) in list" v-if="current >= (index + 1)" v-show="current <= (index + 1)">
      <component :is="type" :item="item" :language="language" @end="next"
      ></component>
    </div>
    <div class="instruction" v-if="current === 0">
      <input class="transparent" type="text" v-focus @keyup="play">
      <div class="instruction-content">
        <p class="instruction-header">{{instructionContent.header}}</p>
        <p class="instruction-body" v-html="instructionContent[sumType]"></p>
        <p class="instruction-footer">{{instructionContent.footer}}</p>
      </div>
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
        <md-icon v-if="result.right !== result.isNon" md-theme="green" class="md-primary">∨</md-icon>
        <md-icon v-else md-theme="orange" class="md-warn">x</md-icon>
      </md-list-item>
    </md-list>
    <md-list v-if="type === TYPE_FLANKER">
      <md-list-item v-for="(result, index) in results[sumType]" key="index">
        <span>
          <template v-if="result.type === 'con'">Congruent/一致</template>
          <template v-else-if="result.type === 'incon'">Incongruent/不一致</template>
          <template v-else-if="result.type === 'neu'">Neutral/中立</template>
        </span>
        <span>
          <small>Selection/选择: </small>
          <strong>{{result.selection}}</strong>
          <small> - {{result.response}}ms</small>
          <md-icon v-if="result.selection === result.direction" md-theme="green" class="md-primary">∨</md-icon>
          <md-icon v-else md-theme="orange" class="md-warn">x</md-icon>
        </span>
      </md-list-item>
    </md-list>
    <md-list v-if="type === TYPE_IQ">
      <md-list-item v-for="(result, index) in results[sumType]" key="index">
        <md-avatar>
          <img :src="result.src">
        </md-avatar>
        <span>{{result.name}} - ({{result.response}}ms)</span>
        <span>Answer/答案 - Choice/作答：<small>{{result.answer}}</small> - {{result.choice}}</span>
        <md-icon v-if="result.answer === result.choice" md-theme="green" class="md-primary">∨</md-icon>
        <md-icon v-else md-theme="orange" class="md-warn">x</md-icon>
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
import Flanker from './Flanker'
import IQTester from './IQTester'

export default {
  name: 'Dashboard',
  props: ['design', 'demo'],
  data () {
    let data = {
      type: '',
      TYPE_PIC: 'picture-naming',
      TYPE_IQ: 'iq-tester',
      TYPE_LEX: 'lexical-decision',
      TYPE_LEX_CN: 'lexical-decision-chinese',
      TYPE_LEX_UG: 'lexical-decision-uyghur',
      TYPE_SIMON: 'simon',
      TYPE_FLANKER: 'flanker',
      language: 'chinese',
      current: -1,
      list: [],
      results: {},
      SECTION_COUNT: 6,
      showError: false,
      yourname: '',
      contact: '',
      realMode: false,
      KEY: {
        START: 32
      }
    }
    data.type = data.TYPE_PIC
    data.results[data.TYPE_PIC] = []
    data.results[data.TYPE_LEX_CN] = []
    data.results[data.TYPE_LEX_UG] = []
    data.results[data.TYPE_IQ] = []
    data.results[data.TYPE_FLANKER] = []
    return data
  },
  methods: {
    blobUrl: function (url) {
      return url && URL.createObjectURL(url)
    },
    start: function () {
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
      console.log('list', this.list)
      this.$nextTick(() => {
        this.current = 0
      })
    },
    play: function (event) {
      if (event.keyCode === this.KEY.START) {
        this.current = 1
      }
    },
    next: function (result) {
      if (result) {
        this.results[this.sumType].push(result)

        if (this.current === this.list.length) {
          this.current = -1
          screenfull.exit()
        } else {
          setTimeout(() => {
            this.current++
          }, 250)
        }
      }
    },
    random: function () {
      const mapper = {}
      mapper[this.TYPE_PIC] = 'randomPictures'
      mapper[this.TYPE_LEX] = 'randomLexical'
      mapper[this.TYPE_IQ] = 'randomIQ'
      mapper[this.TYPE_FLANKER] = 'randomFlanker'
      const methodName = mapper[this.type]
      const list = this[methodName]()
      return _.sampleSize(list, list.length)
    },
    randomFlanker: function () {
      return _.flatMap(this.items, item => {
        return _.fill(Array(item.count), item)
      })
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
      if (this.realMode) {
        return this.design[this.type]
      } else {
        return this.demo[this.type]
      }
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
    },
    instructionContent: function () {
      let content = {}
      const params = window.location.search.match(/(l=)([\w-]+)/)
      if (params && params.length >= 3 && params[2] === 'en-US') {
        content = {
          header: 'Welcome to the experiment!',
          footer: 'Press SPACE bar to start the experiment.'
        }
        content[this.TYPE_LEX_UG] = [
          'Now you will be presented with a series of words.',
          'If the stimulus is a real Uyghur word, press “Red” key as quick as possible;',
          'If the stimulus is a non-Uyghur word, press “Blue” key as quick as possible.'
        ].join('<br/>')
        content[this.TYPE_LEX_CN] = [
          'Now you will be presented with a series of characters.',
          'If the stimulus is a real Chinese character, press ”Red” key as quick as possible;',
          'If the stimulus is a non-Chinese character, press “Blue” key as quick as possible.'
        ].join('<br/>')
        content[this.TYPE_PIC] = [
          'You will be required to name pictures respectively in Uyghur and Chinese.',
          'If you see the cue “说”, speak out the name of following picture in Chinese as quickly as possible;',
          'if you see the cue “-سۆزله”, speak out the name of following picture in Uyghur as quickly as possible.',
          'Try to name the picture as quickly and accurately as possible.'
        ].join('<br/>')
        content[this.TYPE_SIMON] = [
          'In the experiment, if you see the red circle, press “Red” key as quickly as possible;',
          'if you see the blue circle, press “Blue” key as quickly as possible, regardless of its location on the screen.',
          'Press the correct key as quickly as possible.'
        ].join('<br/>')
        content[this.TYPE_FLANKER] = [
          'You will be presented with a series of arrows, choose the direction pointed by the arrow in the CENTRE as quickly as you can, regardless of the direction of other surrounding arrows.',
          'If the arrow in the centre is pointing to the left, press the “Red” key.',
          'If the arrow in the centre is pointing to the right, press the “Blue” key;'
        ].join('<br/>')
        content[this.TYPE_IQ] = 'Please answer the following 60 questions within 40 minutes.'
      } else {
        content = {
          header: '欢迎参加实验！',
          footer: '按空格键开始实验。'
        }
        content[this.TYPE_LEX_UG] = [
          '你将会看到一系列单词。',
          '如果该单词为真维文词，请迅速按红色键；',
          '如果该单词为假维文词，请迅速按蓝色键。'
        ].join('<br/>')
        content[this.TYPE_LEX_CN] = [
          '你将会看到一系列汉字。',
          '如果该字为真汉字，请按红色键；',
          '如果该字为假汉字，请按蓝色键。'
        ].join('<br/>')
        content[this.TYPE_PIC] = [
          '你将分别用维语和汉语对出现的图片进行命名。',
          '看到提示字为“说”时，请迅速用汉语命名接下来出现的图片；',
          '看到提示字为“ -سۆزله”时，请迅速用维语命名接下来出现的图片。',
          '请既快又准确地给图片命名。'
        ].join('<br/>')
        content[this.TYPE_SIMON] = [
          '在实验中，看到红色圆形时，请快速按红色键；',
          '看到蓝色圆形时，请快速按蓝色键，不用管图形出现在屏幕中的位置。',
          '请既快又准确地做出相应判断。'
        ].join('<br/>')
        content[this.TYPE_FLANKER] = [
          '你将会看到一系列的箭头，请快速并准确判断中间位置箭头所指的方向，不用管旁边的箭头方向。',
          '如果中间的箭头指向左边，请快速按红色键。',
          '如果中间的箭头指向右边，请快速按蓝色键；'
        ].join('<br/>')
        content[this.TYPE_IQ] = [
          '请在40分钟内作答下列60道题。',
          '请按相应的数字键进行作答。'
        ].join('<br>')
      }

      return content
    }
  },
  components: {
    'picture-naming': PictureNaming,
    'lexical-decision': LexicalDecision,
    'flanker': Flanker,
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

.instruction {
  display: none;
}

.processing .instruction {
  display: block;
}

.instruction-content {
  width: 80%;
  margin: 300px auto 0;
  font-size: 20px;
}

.instruction-header,
.instruction-body {
  text-align: left;
  line-height: 32px;
}

.instruction-footer {
  margin-top: 50px;
  font-size: 30px;
  color: #888;
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

.md-switch label.md-switch-label {
  position: static;
}
</style>
