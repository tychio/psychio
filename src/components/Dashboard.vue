<template>
  <div>
    <h1>Record</h1>
    <a target="_blank" :href="url">{{url}}</a>
  </div>
</template>

<script>
import MediaStreamRecorder from 'msr'

export default {
  name: 'Dashboard',
  data () {
    let data = {
      url: ''
    }
    navigator.getUserMedia({
      audio: true
    }, stream => {
      data.mediaRecorder = new MediaStreamRecorder(stream)
      data.mediaRecorder.mimeType = 'audio/wav' // check this line for audio/wav
      data.mediaRecorder.ondataavailable = blob => {
        // POST/PUT "Blob" using FormData/XHR2
        data.url = URL.createObjectURL(blob)
      }
      data.mediaRecorder.start(3000)
    }, error => {
      console.error('media error', error)
    })
    return data
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
