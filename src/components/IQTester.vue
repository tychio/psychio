<template>
  <div v-show="status" :class="['stage', 'stage-' + status]">
    <div class="stage-pic" :style="{
      'background-image': 'url(' + imageSrc + ')'
    }"></div>
    <input type="text" v-focus v-if="status === 'playing'" @keyup="end">
  </div>
</template>

<script>
export default {
  name: 'IQTester',
  props: ['item', 'language'],
  data: function () {
    return {
      startDate: 0,
      status: null,
      result: {
        name: this.item.Q,
        answer: this.item.A,
        response: 0,
        choice: 0,
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
      }
    }
  },
  methods: {
    end: function (event) {
      if (!event) {
        this.record()
      } else if (this.status === 'playing') {
        this.record()
        if (event.keyCode > 48 && event.keyCode < 57) {
          this.status = 'end'
          clearTimeout(this.endTimeout)
          this.result.choice = event.keyCode - 48
        }
      }
    },
    record: function () {
      if (this.startDate) {
        this.result.response = new Date() - this.startDate
        this.result.src = this.imageSrc
        this.startDate = 0
      }
    }
  },
  computed: {
    imageSrc: function () {
      return './static/iq-tester/' + this.item.Q + '.jpg'
    }
  },
  mounted: function () {
    this.status = 'playing'
    this.endTimeout = setTimeout(() => {
      this.status = 'end'
    }, 40 * 60 * 1000)
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

.stage-playing .stage-pic {
  display: block;
}

.stage-end {
  display: none;
}
</style>
