<template>
  <div v-show="status" :class="['stage', 'stage-' + status]">
    <div class="stage-pic" :style="{
      'background-image': 'url(' + imageSrc + ')'
    }"></div>
    <div class="feedback">{{feedback}}</div>
    <i class="icon icon-cross"></i>
    <i class="icon icon-dot"></i>
    <input type="text" v-focus v-if="status === 'playing'" @keyup="end">
  </div>
</template>

<script>
import * as _ from 'lodash'

export default {
  name: 'LexicalDecision',
  props: ['item', 'language'],
  data: function () {
    return {
      startDate: 0,
      status: null,
      steps: [],
      result: {
        name: this.item.name,
        isNon: this.item.isNon,
        response: 0,
        right: null,
        language: this.language,
        src: ''
      }
    }
  },
  watch: {
    status: function () {
      if (this.status === 'end') {
        this.end()
        this.$emit('end', this.result)
      } else if (this.status === 'playing') {
        this.startDate = new Date()
      } else if (this.status === 'feedback') {
        this.setStatus('end', this.steps[3])
      }
    }
  },
  methods: {
    end: function (event) {
      if (!event) {
        this.record()
      } else if (this.status === 'playing') {
        clearTimeout(this.endTimeout)
        this.setStatus('feedback')
        this.record()
        this.result.right = (event.keyCode === 13)
      }
    },
    record: function () {
      if (this.startDate) {
        this.result.response = new Date() - this.startDate
        this.result.src = this.imageSrc
        this.startDate = 0
      }
    },
    setStatus: function (status, timeout) {
      if (timeout) {
        return setTimeout(() => {
          this.status = status
        }, timeout)
      } else {
        this.status = status
      }
    }
  },
  computed: {
    imageSrc: function () {
      return './static/lexical-decision/' + this.language + '-' + (this.item.isNon ? 'nonwords' : 'words') + '/' + this.item.name + '.png'
    },
    feedback: function () {
      let feedback = ''
      if (this.result.right === null) {
        feedback = '反应超时'
      } else {
        feedback = this.result.right !== this.result.isNon ? '正确' : '错误'
      }
      return feedback
    }
  },
  mounted: function () {
    this.steps = [1000, 500, 4000, 500]
    this.setStatus('start')
    this.setStatus('ready', this.steps[0])
    this.setStatus('playing', _.sum(_.slice(this.steps, 0, 2)))
    this.endTimeout = this.setStatus('feedback', _.sum(_.slice(this.steps, 0, 3)))
  }
}
</script>

<style scoped>
.stage {
  position: absolute;
  z-index: 9999;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
}

.stage-pic {
  display: none;
  height: 100%;
  width: 100%;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: auto;
  transform: scale(0.25);
}

.feedback {
  display: none;
  font-size: 54px;
  margin-top: 50%;
}

.stage i.icon {
  display: none;
  position: absolute;
  top: 50%;
  left: 50%;
  margin: -100px;
  width: 200px;
  height: 200px;
  line-height: 200px;
  font-style: normal;
  font-size: 100px;
}

i.icon.icon-cross:before {
  content: '+';
}

i.icon.icon-dot:before {
  content: '\00b7';
  font-size: 200px;
}

.stage-prompt i.icon.icon-lang,
.stage-saying i.icon.icon-dot,
.stage-start i.icon.icon-cross {
  display: block;
}

.stage-playing .stage-pic {
  display: block;
}

.stage-feedback .feedback {
  display: block;
}

.stage-end {
  display: none;
}
</style>
