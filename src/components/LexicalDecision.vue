<template>
  <div v-show="status" :class="['stage', 'stage-' + status]">
    <div class="stage-pic" :style="{
      'background-image': 'url(./static/pictures/' + item.name + '.gif)'
    }"></div>
    <i class="icon icon-cross"></i>
    <i class="icon icon-dot"></i>
    <input type="text" v-focus v-if="status === 'playing'" @keyup="end">
  </div>
</template>

<script>
export default {
  name: 'LexicalDecision',
  props: ['item'],
  data: function () {
    return {
      startDate: 0,
      status: null,
      result: {
        name: this.item.name,
        response: 0,
        right: false
      }
    }
  },
  watch: {
    status: function () {
      if (this.status === 'end') {
        this.$emit('end', this.result)
      } else if (this.status === 'playing') {
        this.startDate = new Date()
      }
    }
  },
  methods: {
    end: function (event) {
      if (this.status === 'playing') {
        clearTimeout(this.endTimeout)
        this.status = 'end'
        this.result.response = new Date() - this.startDate
        this.result.right = (event.keyCode === 13)
      }
    }
  },
  mounted: function () {
    const steps = [1000, 500, 4000]
    this.status = 'start'
    setTimeout(() => {
      this.status = 'ready'
    }, steps[0])
    setTimeout(() => {
      this.status = 'playing'
    }, steps[0] + steps[1])
    this.endTimeout = setTimeout(() => {
      this.status = 'end'
    }, steps[0] + steps[1] + steps[2])
  },
  directives: {
    focus: {
      inserted: function (el) {
        setInterval(() => el.focus(), 50)
      }
    }
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
  background-size: contain;
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

.stage-end {
  display: none;
}
</style>
