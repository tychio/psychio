<template>
  <div class="container">
    <template v-if="media">
      <md-button class="md-primary" v-if="item.audio" @click.native="download()">Download audio record</md-button>
      <span v-else-if="isActive">Recording</span>
      <span v-else>No record</span>
    </template>
  </div>
</template>

<script>
import MediaStreamRecorder from 'msr'

export default {
  name: 'Recorder',
  props: ['item', 'active'],
  data () {
    let data = {
      media: null
    }
    return data
  },
  methods: {
    download: function () {
      this.media.save()
    }
  },
  computed: {
    isActive: function () {
      if (this.active) {
        this.media.start(this.item.period)
      } else if (this.media) {
        this.media.stop()
      }
      return this.active
    }
  },
  mounted () {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia
    navigator.getUserMedia({
      audio: true
    }, stream => {
      this.media = new MediaStreamRecorder(stream)
      this.media.mimeType = 'audio/wav'
      this.media.ondataavailable = blob => {
        this.item.audio = URL.createObjectURL(blob)
      }
    }, error => {
      console.error('media error', error)
    })
  }
}
</script>

<style scoped>
  hr {
    margin: 10px;
  }

  .btn {
    height: 25px;
    line-height: 20px;
    width: 80px;
  }
</style>
