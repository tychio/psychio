<template>
  <div v-show="status" :class="['stage', 'stage-' + status]">
    <div class="stage-cycle">
      <span :class="[result.type, result.direction]"></span>
    </div>
    <div class="feedback">{{feedback}}</div>
    <i class="icon icon-cross"></i>
    <input class="transparent" type="text" v-focus v-if="status === 'playing'" @keyup="end">
  </div>
</template>

<script>
import * as _ from 'lodash'

export default {
  name: 'Simon',
  props: ['item'],
  data: function () {
    return {
      KEY: {
        RED: 65,
        BLUE: 76
      },
      startDate: 0,
      status: null,
      steps: [],
      result: {
        type: this.item.type,
        direction: this.item.direction,
        selection: null,
        response: 0
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
        if (event.keyCode === this.KEY.BLUE) {
          this.result.selection = 'blue'
        } else if (event.keyCode === this.KEY.RED) {
          this.result.selection = 'red'
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
      return this.result.selection === this.result.type
    }
  },
  mounted: function () {
    this.steps = [500, 250, 2000, 250]
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

.stage-cycle {
  display: none;
  position: absolute;
  top: 50%;
  width: 100%;
}

.stage-cycle span {
  display: inline-block;
  position: absolute;
  z-index: 1000;
  left: 50%;
  height: 100px;
  width: 100px;
  margin: -50px;
}

.stage-cycle span.right {
  transform: translate(200px);
}

.stage-cycle span.left {
  transform: translate(-200px);
}

.stage-cycle span.blue {
  background-color: #0c83e8; 
}

.stage-cycle span.red {
  background-color: #e80d0d;
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

.stage-playing .stage-cycle {
  display: block;
}

.stage-feedback .feedback {
  display: block;
}

.stage-end {
  display: none;
}

</style>
