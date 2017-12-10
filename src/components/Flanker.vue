<template>
  <div v-show="status" :class="['stage', 'stage-' + status]">
    <div :class="['stage-arrow', {
      'macos': isMac
    }]">
      <span :class="[result.type, result.direction]"><span>{{arrowText}}</span></span>
    </div>
    <div class="feedback">{{feedback}}</div>
    <i class="icon icon-cross"></i>
    <input class="transparent" type="text" v-focus v-if="status === 'playing'" @keyup="end">
  </div>
</template>

<script>
import * as _ from 'lodash'

export default {
  name: 'Flanker',
  props: ['item'],
  data: function () {
    return {
      KEY: {
        LEFT: 65,
        RIGHT: 76
      },
      startDate: 0,
      status: null,
      steps: [],
      result: {
        type: this.item.type,
        direction: this.item.direction,
        selection: null,
        response: 0
      },
      isMac: false
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
        if (event.keyCode === this.KEY.RIGHT) {
          this.result.selection = 'right'
        } else if (event.keyCode === this.KEY.LEFT) {
          this.result.selection = 'left'
        }
        if (this.result.selection) {
          clearTimeout(this.endTimeout)
          this.setStatus('feedback')
          this.record()
        }
      }
    },
    record: function () {
      if (this.startDate) {
        this.result.response = new Date() - this.startDate
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
    arrowText: function () {
      return String.fromCharCode('\8594')
    },
    feedback: function () {
      let feedback = ''
      if (this.result.selection === null) {
        feedback = '反应超时'
      } else {
        feedback = this.isCorrect ? '正确' : '错误'
      }
      return feedback
    },
    isCorrect: function () {
      return this.result.selection === this.result.direction
    }
  },
  mounted: function () {
    this.steps = [500, 250, 2000, 250]
    this.setStatus('start')
    this.setStatus('ready', this.steps[0])
    this.setStatus('playing', _.sum(_.slice(this.steps, 0, 2)))
    this.endTimeout = this.setStatus('feedback', _.sum(_.slice(this.steps, 0, 3)))
    this.isMac = window.navigator.platform === 'MacIntel'
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

.stage-arrow {
  display: none;
  position: absolute;
  top: 34%;
  left: 0;
  right: 0;
  height: 100%;
  width: 100%;
  font-family: 'Consolas';
  font-size: 90px;
  text-align: center;
}

.feedback {
  display: none;
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  text-align: center;
  font-size: 36px;
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

.stage-start i.icon.icon-cross,
.stage-playing i.icon.icon-cross {
  display: block;
}

.stage-playing .stage-arrow {
  display: block;
}

.stage-feedback .feedback {
  display: block;
}

.stage-end {
  display: none;
}

.stage-arrow span.left span {
  display: inline-block;
  transform: rotate(180deg) translateY(-11px) translateX(1px);
}

.stage-arrow.macos span.left span {
  transform: rotate(180deg);
}

.stage-arrow span.right.con:before,
.stage-arrow span.right.con:after,
.stage-arrow span.left.incon:before,
.stage-arrow span.left.incon:after {
  content: '\2192\2192';
  display: inline-block;
}

.stage-arrow span.left.con:before,
.stage-arrow span.left.con:after,
.stage-arrow span.right.incon:before,
.stage-arrow span.right.incon:after {
  content: '\2192\2192';
  display: inline-block;
  transform: rotate(180deg) translateY(-11px) translateX(1px);
}

.stage-arrow.macos span.left.con:before,
.stage-arrow.macos span.left.con:after,
.stage-arrow.macos span.right.incon:before,
.stage-arrow.macos span.right.incon:after {
  transform: rotate(180deg);
}

.stage-arrow span.left.neu:before,
.stage-arrow span.left.neu:after,
.stage-arrow span.right.neu:before,
.stage-arrow span.right.neu:after {
  content: '--';
  display: inline-block;
  transform: translateY(-1px);
}

.stage-arrow.macos span.left.neu:before,
.stage-arrow.macos span.left.neu:after,
.stage-arrow.macos span.right.neu:before,
.stage-arrow.macos span.right.neu:after {
  transform: translateY(2px);
}
</style>
