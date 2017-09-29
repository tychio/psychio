<template>
  <div v-show="status" :class="['stage', 'stage-' + status]">
    <div class="stage-pic" :style="{
      'background-image': 'url(' + imageSrc + ')'
    }"></div>
    <i class="icon icon-cross"></i>
    <i class="icon icon-dot"></i>
    <i class="icon icon-lang">{{languageSay}}</i>
  </div>
</template>

<script>
import MediaStreamRecorder from 'msr'
const SpeechRecognition = window.webkitSpeechRecognition
export default {
  name: 'PictureNaming',
  props: ['item', 'language'],
  data: function () {
    return {
      startDate: 0,
      status: null,
      result: {
        name: this.item.name,
        language: this.item.language,
        response: 0,
        record: null,
        src: ''
      },
      recognition: new SpeechRecognition(),
      media: null
    }
  },
  watch: {
    status: function () {
      if (this.status === 'end') {
        this.record()
        this.recognition.onspeechstart = () => {}
        this.media.stop()
        this.$emit('end', this.result)
      } else if (this.status === 'playing') {
        this.startDate = new Date()
        this.media.start(4000)
      } else if (this.status === 'ready') {
        this.recognition.start()
      }
    }
  },
  methods: {
    loadRecorder: function () {
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia
      navigator.getUserMedia({
        audio: true
      }, stream => {
        this.media = new MediaStreamRecorder(stream)
        this.media.mimeType = 'audio/wav'
        this.media.ondataavailable = blob => {
          this.result.record = blob
        }
      }, error => {
        console.error('media error', error)
      })
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
    languageSay: function () {
      return {
        chinese: '说',
        uyghur: 'ئېيتماق',
        english: 'Say'
      }[this.item.language]
    },
    imageSrc: function () {
      return './static/pictures/' + this.item.name + '.gif'
    }
  },
  mounted: function () {
    this.loadRecorder()
    const steps = [1000, 500, 500, 4000]
    this.recognition.onspeechstart = () => {
      if (this.status === 'playing') {
        this.status = 'saying'
        this.record()
      }
    }
    this.status = 'start'
    setTimeout(() => {
      this.status = 'ready'
    }, steps[0])
    setTimeout(() => {
      this.status = 'prompt'
    }, steps[0] + steps[1])
    setTimeout(() => {
      this.status = 'playing'
    }, steps[0] + steps[1] + steps[2])
    setTimeout(() => {
      this.status = 'end'
    }, steps[0] + steps[1] + steps[2] + steps[3])
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
