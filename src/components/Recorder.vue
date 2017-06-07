<template>
  <div>
    <a v-if="audio.url" :href="audio.url">Record {{(audio.end - audio.start)/1000}} s</a>
    <span v-else-if="isActive">Recording</span>
    <span v-else>No record</span>
    <hr v-if="media">
  </div>
</template>

<script>
import MediaStreamRecorder from 'msr'

export default {
  name: 'Recorder',
  props: ['audio', 'active'],
  data () {
    let data = {
      media: null
    }
    return data
  },
  computed: {
    isActive: function () {
      if (this.active) {
        this.media.start(this.audio.end - this.audio.start)
      } else if (this.media) {
        this.media.stop()
      }
      return this.active
    }
  },
  mounted () {
    navigator.getUserMedia({
      audio: true
    }, stream => {
      this.media = new MediaStreamRecorder(stream)
      console.log('media', this.media)
      this.media.mimeType = 'audio/wav'
      this.media.ondataavailable = blob => {
        this.audio.url = URL.createObjectURL(blob)
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
</style>
