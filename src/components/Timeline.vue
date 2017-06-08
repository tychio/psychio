<template>
<div class="timeline">
  <div class="timeline-block" v-for="(item,index) in list">
    <div v-if="item.type === 'img-audio'">
      <img :src="item.url" height="100">
      <div class="showcase" v-if="index === currentIndex">
        <img :src="item.url">
      </div>
      <Recorder 
        :active="index === currentIndex" 
        :item="item"
      ></Recorder>
    </div>
    <div>
      <input type="number" v-model="item.period">
    </div>
  </div>
</div>
</template>

<script>
import Recorder from './recorder'

export default {
  name: 'timeline',
  props: ['list', 'currentIndex'],
  components: {
    Recorder
  }
}
</script>

<style scoped> 
.showcase {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.showcase img {
  width: 100%;
  height: 100%;
}

.timeline {
}

.timeline-block {
  display: block;
  box-sizing: border-box;
  border: 1px solid #333;
}

.timeline-block img {
  display: block;
  margin: 0 auto;
}
</style>
